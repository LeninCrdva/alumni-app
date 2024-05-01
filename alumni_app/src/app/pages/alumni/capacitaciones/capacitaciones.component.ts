import { Component, Renderer2, ViewChild } from '@angular/core';
import { AlertsService } from '../../../data/Alerts.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Capacitacion } from '../../../data/model/capacitacion';
import { CapacitacionService } from '../../../data/service/capacitacion.service';

@Component({
  selector: 'app-capacitaciones',
  templateUrl: './capacitaciones.component.html',
  styleUrls: ['./capacitaciones.component.css']
})
export class CapacitacionesComponent {

  // =====================================================
  //*               DATA TABLE Y FILTROS
  // =======================================================

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};

  // =====================================================
  //*                   VALIDACIONES
  // =======================================================

  @ViewChild('myModalClose') modalClose: any;

  @ViewChild('codeModal') codeModal!: any;

  capacitacionList: Capacitacion[] = [];

  idEdit: number = 0;

  editarClicked = false;

  validateForm: FormGroup;
  // =====================================================
  //*                   CONSTURCTOR
  // =======================================================

  constructor(
    private fb: FormBuilder,
    private capacitacionesService: CapacitacionService,
    private alertService: AlertsService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    private renderer: Renderer2
  ) {
    this.validateForm = this.fb.group({
      nombre: ['', Validators.required],
      institucion: ['', Validators.required],
      tipoCertificado: ['', Validators.required],
      numHoras: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  // Note: Desuscribirse del evento para evitar fugas de memoria
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Note: Cargar la tabla con los datos despues de que la vista se haya inicializado
  ngOnInit(): void {
    const columnTitles = ['#', 'Nombre', 'Institución', '# Horas', 'Tipo Certificado', 'Fecha Inicio', 'Fecha Fin'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar referencia...');
    // Para inicializar los dropdowns de los filtros de la tabla.
    this.filterService.initializeDropdowns('filterTable', columnTitles,);
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  loadData() {
    this.capacitacionesService.get().subscribe(
      result => {
        this.capacitacionList = [];
        this.capacitacionList = result;

        this.capacitacionList = result.filter(resultData => resultData.cedula === this.obtenerCedula());

        if (this.initializeTable) {
          this.dtTrigger.next(null);
          this.initializeTable = false;
        } else {
          this.dtService.rerender(this.dtElement, this.dtTrigger);
        }
      },
      (error: any) => console.error(error)
    );
  }

  // NOTE: CRUD EVENTS
  onRegistrarClick(): void {
    this.validateForm.reset();

    this.alertService.resetInputsValidations(this.renderer);

    this.editarClicked = false;
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;

    this.validateForm.reset();

    const dataToEdit = this.capacitacionList.find(item => item.id === id);

    if (dataToEdit) {
      this.validateForm.patchValue({
        nombre: dataToEdit.nombre,
        institucion: dataToEdit.institucion,
        tipoCertificado: dataToEdit.tipoCertificado,
        numHoras: dataToEdit.numHoras,
        fechaInicio: dataToEdit.fechaInicio,
        fechaFin: dataToEdit.fechaFin,
      });
    } else {
      console.error(`Elemento con id ${id} no encontrado en la lista.`);
    }

    this.alertService.resetInputsValidations(this.renderer);
    this.idEdit = id;
  }

  onSubmit() {
    if (!this.validateForm.valid) {
      this.alertService.showInputsValidations(this.renderer);
      return;
    }

    const nombre = this.validateForm.value.nombre;
    const fechaInicio = this.validateForm.value.fechaInicio;
    const fechaFin = this.validateForm.value.fechaFin;

    const esNombreUnico = this.validarNombreUnico(nombre, this.idEdit);
    if (!esNombreUnico) {
      this.alertService.mostrarSweetAlert(false, 'El nombre ya está en uso.');
      return;
    }

    const sonFechasValidas = this.validarFechas(fechaInicio, fechaFin);
    if (!sonFechasValidas) {
      this.alertService.mostrarSweetAlert(false, 'La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    console.log('onSubmit', this.editarClicked);
    if (this.editarClicked) {
      this.onUpdateClick();
    } else {
      this.createNewData();
    }
  }

  obtenerDatosFormulario(): any {
    return {
      nombre: this.validateForm.value.nombre,
      institucion: this.validateForm.value.institucion,
      tipoCertificado: this.validateForm.value.tipoCertificado,
      numHoras: this.validateForm.value.numHoras,
      fechaInicio: this.validateForm.value.fechaInicio,
      fechaFin: this.validateForm.value.fechaFin,
      cedula: this.obtenerCedula()
    };
  }

  createNewData() {
    this.alertService.mostrarAlertaCargando('Guardando...');
   
    this.capacitacionesService.create(this.obtenerDatosFormulario()).subscribe(
      result => {
        this.alertService.mostrarSweetAlert(true, 'Creado correctamente.', this.modalClose);
      
        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al crear.');
        console.error('Error al crear:', error);
      }
    );
  }

  onUpdateClick() {
    this.alertService.mostrarAlertaCargando('Actualizando...');
    this.capacitacionesService.update(this.idEdit, this.obtenerDatosFormulario()).subscribe(
      result => {
        this.alertService.mostrarSweetAlert(true, 'Actualizado correctamente.', this.modalClose);
        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al actualizar.');
      }
    );
  }

  onDeleteClick(id: number | undefined = 0) {
    this.alertService.mostrarAlertaCargando('Eliminando...');

    this.capacitacionesService.delete(id).subscribe(
      () => {
        this.alertService.mostrarSweetAlert(true, 'Se ha eliminado correctamente.');

        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al eliminar.');
      }
    );
  }

  validarNombreUnico(nombre: string, idEdit: number): boolean {
    const existe = this.capacitacionList.some(capacitacion => capacitacion.nombre.toLowerCase() === nombre.toLowerCase() && capacitacion.id !== idEdit);
    return !existe;
  }

  validarFechas(fechaInicio: string, fechaFin: string): boolean {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return fin >= inicio;
  }

  obtenerCedula(): string {
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      return userData.persona.cedula;
    }
    return '';
  }
}