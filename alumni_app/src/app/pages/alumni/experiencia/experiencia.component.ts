import { Component, Renderer2, ViewChild } from '@angular/core';
import { Experiencia } from '../../../data/model/experiencia';
import { ExperienciaService } from '../../../data/service/experiencia.service';
import { AlertsService } from '../../../data/Alerts.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent {

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

  experienciaList: Experiencia[] = [];

  idEdit: number = 0;

  editarClicked = false;

  validateForm: FormGroup;

  // =====================================================
  //*                   CONSTRUCTOR
  // =======================================================

  constructor(
    private fb: FormBuilder,
    private experienciaService: ExperienciaService,
    private alertService: AlertsService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    private renderer: Renderer2
  ) {
    this.validateForm = this.fb.group({
      cargo: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]],
      duracion:  ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/) 
      ]],
      area_trabajo:  ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]],
      institucionNombre:  ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]],
      actividad:  ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]]
    });
  }

  // Note: Desuscribirse del evento para evitar fugas de memoria
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Note: Cargar la tabla con los datos despues de que la vista se haya inicializado
  ngOnInit(): void {
    const columnTitles = ['#', 'Cargo', 'Duración', 'Institucion', 'Actividad', 'Area de trabajo'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar experiencia...');
    // Para inicializar los dropdowns de los filtros de la tabla.
    this.filterService.initializeDropdowns('filterTable', columnTitles,);
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  loadData() {
    this.experienciaService.get().subscribe(
      result => {
        this.experienciaList = [];
        this.experienciaList = result;

        this.experienciaList = result.filter(resultData => resultData.cedulaGraduado === this.obtenerCedula());

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

    const dataToEdit = this.experienciaList.find(item => item.id === id);

    if (dataToEdit) {
      this.validateForm.patchValue({
        cargo: dataToEdit.cargo,
        duracion: dataToEdit.duracion,
        area_trabajo: dataToEdit.areaTrabajo,
        institucionNombre: dataToEdit.institucionNombre,
        actividad: dataToEdit.actividad,
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
      cargo: this.validateForm.value['cargo'],
      duracion: this.validateForm.value['duracion'],
      areaTrabajo: this.validateForm.value['area_trabajo'],
      institucionNombre: this.validateForm.value['institucionNombre'],
      actividad: this.validateForm.value['actividad'],
      cedulaGraduado: this.obtenerCedula()
    };
  }

  createNewData() {
    this.experienciaService.create(this.obtenerDatosFormulario()).subscribe(
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
    this.experienciaService.update(this.idEdit, this.obtenerDatosFormulario()).subscribe(
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
    this.alertService.mostrarAlertaCargando('Eliminando la experiencia seleccionada...');

    this.experienciaService.delete(id).subscribe(
      () => {
        this.alertService.mostrarSweetAlert(true, 'La experiencia se ha eliminado correctamente.');

        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al eliminar la experiencia.');
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