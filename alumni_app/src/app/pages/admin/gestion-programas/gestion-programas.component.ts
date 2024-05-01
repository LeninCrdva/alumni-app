import { Component, Renderer2, ViewChild, OnInit } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { Eventos } from '../../../data/model/Eventos';
import { Eventos_Service } from '../../../data/service/eventoservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { XmlserviceService } from '../../../data/service/xmlservice.service';
import { componentxml } from '../../../data/model/componentxml';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersServicexml } from '../../../data/Filters.servicexml';
import { AlertsServicexml } from '../../../data/service/AlertsServicexml';
import { ImageHandlerServicebyte } from '../../../data/service/ImageHandlerServicebyte';
@Component({
  selector: 'app-gestion-programas',
  templateUrl: './gestion-programas.component.html',
  styleUrls: ['./gestion-programas.component.css']
})
export class GestionProgramasComponent {

  gestionProgramasList: Eventos[] = [];

  editarClicked = false;
  xmlcomponents: componentxml[] = [];

  validateForm: FormGroup;

  initializeTable: boolean = true;

  @ViewChild(DataTableDirective, { static: false })

  dtElement!: DataTableDirective;

  @ViewChild('myModalClose') modalClose: any;

  @ViewChild('codeModal') codeModal!: any;

  dtoptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();
  selectedTipo: string = '';

  idEdit: number = 0;
  formValidateAlert!: HTMLFormElement;

  constructor
    (
      private fb: FormBuilder,
      private programasService: Eventos_Service,
      private alertService: AlertsServicexml,
      public dtService: DataTablesService,
      public filterService: FiltersServicexml,
      private renderer: Renderer2,
      private servicexml: XmlserviceService,
      public imageHandlerService: ImageHandlerServicebyte
    ) {
    this.validateForm = this.fb.group({
      titulo: ['', Validators.required],
      subTitulo: ['', Validators.required],
      resumen: ['', Validators.required],
      tipoxml: ['', Validators.required],
      colorFondo: ['', Validators.required],
    });
  }

  listarProgramas(): void {
    this.servicexml.get().subscribe(
      (data: componentxml[]) => {
        this.xmlcomponents = data;
      },
      error => {
        console.error('Error al obtener los programas misionales:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    const columnTitles = ['#', 'Título', 'Subtitulo', 'Resumen', 'Tipo xml'];

    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar programa...');
    this.filterService.initializeDropdowns(columnTitles, this.dtElement);

    this.loadData();
    this.listarProgramas();
  }

  loadData() {
    this.programasService.get().subscribe(
      result => {
        this.gestionProgramasList = [];
        this.gestionProgramasList = result;
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
    this.editarClicked = false;

    this.validateForm.reset();
    this.imageHandlerService.clearImage();

    this.alertService.resetInputsValidations(this.renderer);

    this.validateForm.patchValue({
      tipoxml: ''
    });
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;

    this.validateForm.reset();
    this.alertService.resetInputsValidations(this.renderer);
    this.imageHandlerService.clearImage();

    const listItems = this.gestionProgramasList.find(item => item.id_prom === id);

    if (listItems) {
      this.validateForm.patchValue({
        titulo: listItems.titulo,
        subTitulo: listItems.subTitulo,
        resumen: listItems.resumen,
        tipoxml: listItems.tipoxml,
        colorFondo: listItems.colorFondo
      });

      this.imageHandlerService.previsualizacion = 'data:image/png;base64,' + listItems.foto_portada;
    }

    this.idEdit = id;
  }

  onSubmit() {
    if (this.editarClicked) {
      this.onUpdateClick();
    } else {
      this.createNewData();
    }
  }

  createNewData() {
    this.editarClicked = false;

    if (this.validateForm.valid && this.imageHandlerService.archivos.length > 0) {
      const formData = new FormData();
      const imagen = this.imageHandlerService.archivos[0];

      Object.keys(this.validateForm.value).forEach(key => {
        formData.append(key, this.validateForm.value[key]);
      });
      formData.append('componentxml', this.selectedTipo);
      formData.append('foto_portada', imagen);

      this.alertService.mostrarAlertaCargando('Creando programa misional...');
      this.programasService.create(formData).subscribe(
        result => {
          this.alertService.mostrarSweetAlert(true, 'Creado exitosamente.', this.modalClose);
          this.loadData();
        },
        error => {
          this.alertService.mostrarSweetAlert(false, 'Error al crear.', false);
        }
      );
    } else {
      this.alertService.showInputsValidations(this.renderer);

      this.alertService.mostrarAlertaSweet();
    }
  }

  onUpdateClick() {
    if (this.validateForm.dirty || this.imageHandlerService.archivos.length > 0) {
      if (this.validateForm.valid) {
        const formData = new FormData();

        if (this.imageHandlerService.archivos.length > 0) {
          const imagen = this.imageHandlerService.archivos[0];
          formData.append('foto_portada', imagen);
        }

        Object.keys(this.validateForm.value).forEach(key => {
          formData.append(key, this.validateForm.value[key]);
        });
        formData.append('componentxml', this.selectedTipo);

        this.alertService.mostrarAlertaCargando('Actualizando programa misional...');

        this.programasService.update(this.idEdit, formData).subscribe(
          result => {
            this.alertService.mostrarSweetAlert(true, 'Actualizado correctamente.', this.modalClose);
            this.loadData();
          },
          error => {
            this.alertService.mostrarSweetAlert(false, 'Error al actualizar.', false);
          }
        );
      } else {
        this.alertService.showInputsValidations(this.renderer);

        this.alertService.mostrarAlertaSweet();
      }
    } else {
      // Si no hay cambios en el formulario ni se seleccionó una nueva imagen, muestra una alerta
      this.alertService.mostrarAlertaSweet('No se detectaron cambios para actualizar.');
    }
  }


  onDeleteClick(id: number | undefined = 0) {
    this.alertService.mostrarAlertaCargando('Eliminando programa misional...');
    this.programasService.delete(id).subscribe(
      () => {
        this.alertService.mostrarSweetAlert(true, 'Eliminado exitosamente.', false);
        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al eliminar.');
      }
    );
  }
}