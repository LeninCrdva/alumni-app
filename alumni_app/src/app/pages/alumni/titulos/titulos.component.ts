import { Component, Renderer2, ViewChild } from '@angular/core';
import { AlertsService } from '../../../data/Alerts.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GraduadoService } from '../../../data/service/graduado.service';
import { Titulo } from '../../../data/model/titulo';
import { TituloService } from '../../../data/service/titulo.service';
import { CarreraService } from '../../../data/service/carrera.service';
import { Carrera } from '../../../data/model/carrera';

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.css']
})
export class TitulosComponent {

  // =====================================================
  //*               DATA TABLE Y FILTROS
  // =======================================================

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};
  public carrerasList: Carrera[] = [];

  // =====================================================
  //*                   VALIDACIONES
  // =======================================================

  @ViewChild('myModalClose') modalClose: any;

  @ViewChild('codeModal') codeModal!: any;

  titulosList: Titulo[] = [];

  idEdit: number = 0;

  editarClicked = false;

  validateForm: FormGroup;

  protected name: string | null = localStorage.getItem('name');

  numeroUndefinido: number = 0;
  invalidCharacters: boolean = false;

  // =====================================================
  //*                   CONSTURCTOR
  // =======================================================

  constructor(
    private fb: FormBuilder,
    private tituloService: TituloService,
    private alertService: AlertsService,
    private carrerasService: CarreraService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    private renderer: Renderer2,
    private usuarioGraduado: GraduadoService
  ) {
    this.validateForm = this.fb.group({
      nombreTitulo:  ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]],
      tipo: ['', Validators.required],
      numRegistro: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(20), 
        Validators.pattern(/^[0-9]+$/) 
      ]],
      
      fechaEmision: ['', [Validators.required]],
      fechaRegistro: ['', Validators.required],
      nivel: ['', Validators.required],
      institucion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ,;\s]+$/)]],
      nombreCarrera: ['', Validators.required],
      otro: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$')]]
    });
   
  }
  //Validaciones  de fecha
  validarFechaEmision() {
    const fechaRegistro = this.validateForm.get('fechaRegistro')?.value;
    const fechaEmision = this.validateForm.get('fechaEmision')?.value;
    if (fechaRegistro && fechaEmision) {
      const fechaRegistroObj = new Date(fechaRegistro);
      const fechaEmisionObj = new Date(fechaEmision);
      return fechaEmisionObj >= fechaRegistroObj;
    }
    return false;
  }
  
  onFechaRegistroChange() {
    const fechaRegistroControl = this.validateForm.get('fechaRegistro');
    const fechaEmisionControl = this.validateForm.get('fechaEmision');
  
    if (fechaRegistroControl && fechaEmisionControl) {
      if (fechaRegistroControl.value) {
        fechaEmisionControl.enable();
      } else {
        fechaEmisionControl.disable();
      }
    }
  }
  

  // Note: Desuscribirse del evento para evitar fugas de memoria
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Note: Cargar la tabla con los datos despues de que la vista se haya inicializado
  ngOnInit(): void {
    const columnTitles = ['#', 'Título', 'Tipo', 'Nivel', 'Institución', 'Carrera', 'Fecha Emisión', 'Fecha Registro', '# Registro'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar titulos...');

    // Para inicializar los dropdowns de los filtros de la tabla.
    this.obtenerCedula();
    this.filterService.initializeDropdowns('filterTable', columnTitles);
    this.obtenerCarreras();
    this.loadData();
    this.validateForm.get('fechaRegistro')?.valueChanges.subscribe(() => {
      this.onFechaRegistroChange();
    });
  }
 
  
  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  loadData() {
    this.tituloService.get().subscribe(
      result => {
        this.titulosList = [];
        this.titulosList = result;
        

        this.titulosList = result.filter(resultData => resultData.cedula === this.obtenerCedula());

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
    this.filterService.selectFirstItem('careersList');

    this.editarClicked = false;
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;

    this.validateForm.reset();

    const dataToEdit = this.titulosList.find(item => item.id === id);

    if (dataToEdit) {
      this.validateForm.patchValue({
        nombreTitulo: dataToEdit.nombreTitulo,
        tipo: dataToEdit.tipo,
        numRegistro: dataToEdit.numRegistro,
        fechaEmision: dataToEdit.fechaEmision,
        fechaRegistro: dataToEdit.fechaRegistro,
        nivel: dataToEdit.nivel,
        institucion: dataToEdit.institucion
      });

      this.filterService.selectItemByName('careersList', dataToEdit.nombreCarrera);

      if (dataToEdit.nombreCarrera === 'OTRO') {
        this.validateForm.patchValue({
          otro: dataToEdit.otro 
        });
      }
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
    // Buscar en la lista de carreras para encontrar el id correspondiente al nombre seleccionado
    // const carreraSeleccionada = this.carrerasList.find(carrera => carrera.nombre === this.validateForm.value.nombrecarrera[0].item_text);
    let nombreCarrera = '';
    if (this.validateForm.value.nombreCarrera) {
        nombreCarrera = this.validateForm.value.nombreCarrera[0]?.item_text;
    }
    return {
      nombreTitulo: this.validateForm.value.nombreTitulo,
      tipo: this.validateForm.value.tipo,
      numRegistro: this.validateForm.value.numRegistro.toString(),
      fechaEmision: this.validateForm.value.fechaEmision,
      fechaRegistro: this.validateForm.value.fechaRegistro,
      nivel: this.validateForm.value.nivel,
      institucion: this.validateForm.value.institucion,
      nombreCarrera: nombreCarrera,
      otro: nombreCarrera === 'OTRO' ? this.validateForm.value.otro : '',
      cedula: this.obtenerCedula()
    };
  }


  createNewData() {
    this.alertService.mostrarAlertaCargando('Guardando...');
    const titulo: Titulo = this.obtenerDatosFormulario();
    
    this.tituloService.create(titulo).subscribe(
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
    const titulo: Titulo = this.obtenerDatosFormulario();
    this.tituloService.update(this.idEdit, titulo).subscribe(
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

    this.tituloService.delete(id).subscribe(
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
  
  
  obtenerCarreras() {
    this.carrerasService.getCarreras().subscribe(
      carreras => {
        this.carrerasList = carreras;
  
        // Agregar la opción "Otro" al final de la lista de carreras
        this.filterService.dropdownLists['careersList'] = [...this.carrerasList.map(carrera => carrera.nombre)];
  
        // Para inicializar los dropdowns de las diferentes carreras.
        this.filterService.initializeDropdowns('careersList', this.filterService.dropdownLists['careersList'], true);
      },
      (error: any) => console.error(error)
    );
  }
  
}