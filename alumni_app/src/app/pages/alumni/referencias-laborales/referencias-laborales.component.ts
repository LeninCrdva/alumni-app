import { Component, Renderer2, ViewChild } from '@angular/core';
import { AlertsService } from '../../../data/Alerts.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Referencias_profesionales } from '../../../data/model/referencia_profesional';
import { ReferenciaProfesionalService } from '../../../data/service/referenciaprofesional.service';

@Component({
  selector: 'app-referencias-laborales',
  templateUrl: './referencias-laborales.component.html',
  styleUrls: ['./referencias-laborales.component.css']
})
export class ReferenciasLaboralesComponent {

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

  referenciaProfesionalList: Referencias_profesionales[] = [];

  idEdit: number = 0;

  editarClicked = false;

  validateForm: FormGroup;

  // =====================================================
  //*                   CONSTURCTOR
  // =======================================================

  constructor(
    private fb: FormBuilder,
    private referenciaProService: ReferenciaProfesionalService,
    private alertService: AlertsService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    private renderer: Renderer2
  ) {
    this.validateForm = this.fb.group({
      institucion: ['', Validators.required],
      email: ['', Validators.required],
      nombre: ['', Validators.required]
    });
  }

  // Note: Desuscribirse del evento para evitar fugas de memoria
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Note: Cargar la tabla con los datos despues de que la vista se haya inicializado
  ngOnInit(): void {
    const columnTitles = ['#', 'Nombre', 'Institución', 'Email'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar referencia...');
    // Para inicializar los dropdowns de los filtros de la tabla.
    this.filterService.initializeDropdowns('filterTable', columnTitles,);
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  loadData() {
    this.referenciaProService.get().subscribe(
      result => {
        this.referenciaProfesionalList = [];
        this.referenciaProfesionalList = result;

        this.referenciaProfesionalList = result.filter(resultData => resultData.graduado === this.obtenerCedula());

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

    const dataToEdit = this.referenciaProfesionalList.find(item => item.id === id);

    if (dataToEdit) {
      this.validateForm.patchValue({
        institucion: dataToEdit.institucion,
        email: dataToEdit.email,
        nombre: dataToEdit.nombre,
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

    if (this.editarClicked) {
      this.onUpdateClick();
    } else {
      this.createNewData();
    }
  }

  obtenerDatosFormulario(): any {
    return {
      institucion: this.validateForm.value.institucion,
      email: this.validateForm.value.email,
      nombre: this.validateForm.value.nombre,
      graduado: this.obtenerCedula()
    };
  }

  createNewData() {
    this.alertService.mostrarAlertaCargando('Guardando...');
    this.referenciaProService.create(this.obtenerDatosFormulario()).subscribe(
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
    this.referenciaProService.update(this.idEdit, this.obtenerDatosFormulario()).subscribe(
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

    this.referenciaProService.delete(id).subscribe(
      () => {
        this.alertService.mostrarSweetAlert(true, 'Se ha eliminado correctamente.');

        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al eliminar.');
      }
    );
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