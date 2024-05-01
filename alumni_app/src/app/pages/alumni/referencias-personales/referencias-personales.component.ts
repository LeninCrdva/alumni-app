import { Component, Renderer2, ViewChild } from '@angular/core';
import { AlertsService } from '../../../data/Alerts.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Referencias_personales } from '../../../data/model/referencia_personal';
import { ReferenciaPersonalService } from '../../../data/service/referenciapersonal.service';

@Component({
  selector: 'app-referencias-personales',
  templateUrl: './referencias-personales.component.html',
  styleUrls: ['./referencias-personales.component.css']
})
export class ReferenciasPersonalesComponent {

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

  referenciaPersonalList: Referencias_personales[] = [];

  idEdit: number = 0;

  editarClicked = false;

  validateForm: FormGroup;

  // =====================================================
  //*                   CONSTURCTOR
  // =======================================================

  constructor(
    private fb: FormBuilder,
    private referenciaPService: ReferenciaPersonalService,
    private alertService: AlertsService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    private renderer: Renderer2
  ) {
    this.validateForm = this.fb.group({
      nombreReferencia: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  // Note: Desuscribirse del evento para evitar fugas de memoria
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Note: Cargar la tabla con los datos despues de que la vista se haya inicializado
  ngOnInit(): void {
    const columnTitles = ['#', 'Nombre', 'Teléfono', 'Email'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar referencia...');
    // Para inicializar los dropdowns de los filtros de la tabla.
    this.filterService.initializeDropdowns('filterTable', columnTitles,);
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  loadData() {
    this.referenciaPService.get().subscribe(
      result => {
        this.referenciaPersonalList = [];
        this.referenciaPersonalList = result;

        this.referenciaPersonalList = result.filter(resultData => resultData.cedulaGraduado === this.obtenerCedula());

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

    const dataToEdit = this.referenciaPersonalList.find(item => item.id === id);

    if (dataToEdit) {
      this.validateForm.patchValue({
        nombreReferencia: dataToEdit.nombreReferencia,
        telefono: dataToEdit.telefono,
        email: dataToEdit.email,
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
      nombreReferencia: this.validateForm.value.nombreReferencia,
      email: this.validateForm.value.email,
      telefono: this.validateForm.value.telefono,
      cedulaGraduado: this.obtenerCedula()
    };
  }

  createNewData() {
    this.alertService.mostrarAlertaCargando('Guardando...');
    this.referenciaPService.create(this.obtenerDatosFormulario()).subscribe(
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
    this.referenciaPService.update(this.idEdit, this.obtenerDatosFormulario()).subscribe(
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

    this.referenciaPService.delete(id).subscribe(
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