import { Component, Renderer2, ViewChild } from '@angular/core';
import { OfertalaboralService } from '../../../data/service/ofertalaboral.service';
import { Empresa } from '../../../data/model/empresa';
import { EmpresaService } from '../../../data/service/empresa.service';
import { ofertaLaboralDTO } from '../../../data/model/DTO/ofertaLaboralDTO';
import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Graduado } from '../../../data/model/graduado';
import { Subject } from 'rxjs';
import { ImageHandlerServiceFoto } from '../../../data/service/ImageHandlerServiceFoto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '../../../data/Alerts.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { DataTableDirective } from 'angular-datatables';
import { PostulacionService } from '../../../data/service/postulacion.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-postulaciones-add-form',
  templateUrl: './ofertas-laborales.component.html',
  styleUrls: ['./ofertas-laborales.component.css']
})
export class OfertasLaboralesComponent {

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

  // =====================================================
  //*                   LISTAS Y OBJETOS
  // =======================================================

  activeGraduados: Graduado[] = [];
  allGraduados: Graduado[] = [];
  empresas: Empresa[] = [];
  fechaPublicacion: Date = new Date();
  filtropostulados: number = 1;
  idOferta: number = 0;
  inactiveGraduados: Graduado[] = [];
  name: string | null = localStorage.getItem('name');
  ofertaslaboralesCarga: any = {};
  ofertaslaboraleslist: ofertaLaboralDTO[] = [];
  selectedIDs: number[] = [];
  selectedRows: boolean[] = [];

  // =====================================================
  //*                   VARIABLES
  // =======================================================

  activeSelectPostulant: boolean = false;
  editarClicked = false;
  estado: boolean = true;
  existenPostulantes: boolean = true;
  fechaActual = new Date();
  idEdit: number = 0;
  showSecondStyle: boolean = false;
  showThirdStyle: boolean = false;
  validateForm: FormGroup;

  constructor(
    public imageHandlerService: ImageHandlerServiceFoto,
    public bsModalRef: BsModalRef,
    public filterService: FiltersService,
    public dtService: DataTablesService,
    private fb: FormBuilder,
    private ofertalaburoService: OfertalaboralService,
    private empresaService: EmpresaService,
    private alertService: AlertsService,
    private renderer: Renderer2,
    private postulacionService: PostulacionService
  ) {
    this.validateForm = this.fb.group({
      salario: ['', [Validators.required]],
      fechaCierre: ['', [Validators.required]],
      fechaPublicacion: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      experiencia: ['', [Validators.required]],
      fechaApertura: ['', [Validators.required]],
      areaConocimiento: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      nombreEmpresa: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    const columnTitles = ['#', 'Salario', 'Fecha de Publicación', 'Estado', 'Nombre de Empresa', 'Tipo'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar oferta...');
    this.filterService.initializeDropdowns('filterTable', columnTitles,);
    this.loadData();
    this.getMisEmpresas();
  }

  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  loadData() {
    this.ofertalaburoService.OfertasLaborales(this.name || "").subscribe(
      ofertas => {
        this.ofertaslaboraleslist = ofertas;

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

  selectStyle(): void {
    const estilo = this.validateForm.get('tipo')?.value;

    if (estilo === 'estilo1') {
      this.showSecondStyle = false;
      this.showThirdStyle = false;
    } else if (estilo === 'estilo2') {
      this.showSecondStyle = true;
      this.showThirdStyle = false;
    } else if (estilo === 'estilo3') {
      this.showSecondStyle = false;
      this.showThirdStyle = true;
    }
  }

  initForm() {
    this.getFechaPublicacion();

    this.validateForm = this.fb.group({
      salario: ['', [Validators.required]],
      fechaCierre: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      experiencia: ['', [Validators.required]],
      fechaApertura: ['', [Validators.required]],
      areaConocimiento: ['', [Validators.required]],
      nombreEmpresa: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
      tipo: 'estilo1',
      estado: 'EN REVISION',
      fechaPublicacion: [this.fechaPublicacion, Validators.required],
    })
  }

  onRegistrarClick(): void {
    this.validateForm.reset();

    this.alertService.resetInputsValidations(this.renderer);

    this.initForm();

    this.imageHandlerService.clearImage();

    this.editarClicked = false;

    this.showSecondStyle = false;

    this.showThirdStyle = false;
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;

    this.validateForm.reset();
    this.selectedOption = 'no';
    this.initForm();

    this.imageHandlerService.clearImage();

    const dataToEdit = this.ofertaslaboraleslist.find(item => item.id === id);

    if (dataToEdit) {

      this.imageHandlerService.getPrevisualizacion(dataToEdit.fotoPortada);

      this.fechaPublicacion = new Date(dataToEdit.fechaPublicacion);

      this.validateForm.patchValue({
        salario: dataToEdit.salario,
        fechaCierre: dataToEdit.fechaCierre,
        cargo: dataToEdit.cargo,
        experiencia: dataToEdit.experiencia,
        fechaApertura: dataToEdit.fechaApertura,
        areaConocimiento: dataToEdit.areaConocimiento,
        nombreEmpresa: dataToEdit.nombreEmpresa,
        tipo: dataToEdit.tipo,
        tiempo: dataToEdit.tiempo,
        fotoPortada: dataToEdit.fotoPortada,
        estado: dataToEdit.estado,
      });

      this.selectStyle();
    } else {
      console.error(`Elemento con id ${id} no encontrado en la lista.`);
    }

    this.alertService.resetInputsValidations(this.renderer);

    this.idEdit = id;
  }

  onSubmit() {

    if (this.showSecondStyle) {
      this.initSecondStyleForm();
    } else if (this.showThirdStyle) {
      this.initThirdStyleForm();
    } else {
      this.initFirstStyleForm();
    }

    if (!this.validateForm.valid) {
      this.alertService.showInputsValidations(this.renderer);
      return;
    }

    if (this.editarClicked) {
      this.updateOfertaLaboral();
    } else {
      this.createOfertaLaboral();
    }
  }

  initFirstStyleForm() {
    this.validateForm = this.fb.group({
      salario: [this.validateForm.value['salario'], Validators.required],
      fechaCierre: [
        this.validateForm.value['fechaCierre'],
        [
          Validators.required,
          (control: FormControl) => {
            const fechaPublicacion = this.validateForm.value['fechaPublicacion'];
            const fechaApertura = this.validateForm.value['fechaApertura'];
            const fechaCierre = control.value;

            if (fechaCierre < fechaPublicacion) {
              return { fechaCierreMenorPublicacion: true };
            }

            if (fechaCierre < fechaApertura) {
              return { fechaCierreMenorApertura: true };
            }

            return null;
          },
        ],
      ],
      fechaPublicacion: [formatDate(this.validateForm.value['fechaPublicacion'], 'yyyy-MM-ddTHH:mm:ss', 'en-US'), Validators.required],
      cargo: [this.validateForm.value['cargo'], Validators.required],
      experiencia: [this.validateForm.value['experiencia'], Validators.required],
      fechaApertura: [
        this.validateForm.value['fechaApertura'],
        [
          Validators.required,
          (control: FormControl) => {
            const fechaPublicacion = this.validateForm.value['fechaPublicacion'];
            const fechaApertura = control.value;
            const fechaCierre = this.validateForm.value['fechaCierre'];

            if (fechaApertura < fechaPublicacion) {
              return { fechaAperturaMenorPublicacion: true };
            }

            if (fechaApertura > fechaCierre) {
              return { fechaAperturaMayorCierre: true };
            }

            return null;
          },
        ],
      ],
      areaConocimiento: [this.validateForm.value['areaConocimiento'], Validators.required],
      estado: [this.validateForm.value['estado'], Validators.required],
      nombreEmpresa: [this.validateForm.value['nombreEmpresa'], Validators.required],
      tipo: [this.validateForm.value['tipo'], Validators.required],
      tiempo: [this.validateForm.value['tiempo'], Validators.required],
    });
  }

  initSecondStyleForm() {
    this.validateForm = this.fb.group({
      cargo: [this.validateForm.value['cargo'], Validators.required],
      nombreEmpresa: [this.validateForm.value['nombreEmpresa'], Validators.required],
      fechaPublicacion: [formatDate(this.validateForm.value['fechaPublicacion'], 'yyyy-MM-ddTHH:mm:ss', 'en-US'), Validators.required],
      tiempo: [this.validateForm.value['tiempo'], Validators.required],
      fechaCierre: [this.validateForm.value['fechaCierre'], Validators.required],
      areaConocimiento: [this.validateForm.value['areaConocimiento'], Validators.required],
      estado: [this.validateForm.value['estado'], Validators.required],
      tipo: [this.validateForm.value['tipo'], Validators.required],
      fotoPortada: [this.imageHandlerService.previsualizacion, Validators.required],
    })
  }

  initThirdStyleForm() {
    this.validateForm = this.fb.group({
      nombreEmpresa: [this.validateForm.value['nombreEmpresa'], Validators.required],
      fechaPublicacion: [formatDate(this.validateForm.value['fechaPublicacion'], 'yyyy-MM-ddTHH:mm:ss', 'en-US'), Validators.required],
      estado: [this.validateForm.value['estado'], Validators.required],
      tipo: [this.validateForm.value['tipo'], Validators.required],
      fotoPortada: [this.imageHandlerService.previsualizacion, Validators.required],
    })
  }

  obtenerDatosFormulario(): ofertaLaboralDTO {
    let oferta: ofertaLaboralDTO = new ofertaLaboralDTO();

    if (this.validateForm.value['tipo'] === 'estilo1') {
      oferta = this.obtenerDatosFormularioEstilo1();
    } else if (this.validateForm.value['tipo'] === 'estilo2') {
      oferta = this.obtenerDatosFormularioEstilo2();
    } else {
      oferta = this.obtenerDatosFormularioEstilo3();
    }

    return oferta ? oferta : new ofertaLaboralDTO();
  }

  obtenerDatosFormularioEstilo1(): ofertaLaboralDTO {
    let oferta: ofertaLaboralDTO = new ofertaLaboralDTO();

    oferta.cargo = this.validateForm.value['cargo'];
    oferta.nombreEmpresa = this.validateForm.value['nombreEmpresa'];
    oferta.fechaPublicacion = this.validateForm.value['fechaPublicacion'];
    oferta.fechaApertura = this.validateForm.value['fechaApertura'];
    oferta.fechaCierre = this.validateForm.value['fechaCierre'];
    oferta.tiempo = this.validateForm.value['tiempo'];
    oferta.areaConocimiento = this.validateForm.value['areaConocimiento'];
    oferta.salario = this.validateForm.value['salario'];
    oferta.tipo = this.validateForm.value['tipo'];
    oferta.experiencia = this.validateForm.value['experiencia'];

    return oferta;
  }

  obtenerDatosFormularioEstilo2(): ofertaLaboralDTO {
    let oferta: ofertaLaboralDTO = new ofertaLaboralDTO();
    oferta.cargo = this.validateForm.value['cargo'];
    oferta.nombreEmpresa = this.validateForm.value['nombreEmpresa'];
    oferta.fechaPublicacion = this.validateForm.value['fechaPublicacion'];
    oferta.fechaApertura = this.validateForm.value['fechaApertura'];
    oferta.fechaCierre = this.validateForm.value['fechaCierre'];
    oferta.areaConocimiento = this.validateForm.value['areaConocimiento'];
    oferta.tiempo = this.validateForm.value['tiempo'];
    oferta.tipo = this.validateForm.value['tipo'];
    oferta.fotoPortada = this.imageHandlerService.previsualizacion;

    return oferta;
  }

  obtenerDatosFormularioEstilo3(): ofertaLaboralDTO {
    let oferta: ofertaLaboralDTO = new ofertaLaboralDTO();

    oferta.fechaPublicacion = this.validateForm.value['fechaPublicacion'];
    oferta.nombreEmpresa = this.validateForm.value['nombreEmpresa'];
    oferta.tipo = this.validateForm.value['tipo'];
    oferta.fotoPortada = this.imageHandlerService.previsualizacion;

    return oferta;
  }

  capturarImagen(event: any) {
    this.imageHandlerService.capturarFile(event);
    this.imageHandlerService.previsualizacion;
  }

  createOfertaLaboral() {
    this.ofertalaburoService.createOfertaLaboral(this.obtenerDatosFormulario()).subscribe(
      result => {
        this.alertService.mostrarSweetAlert(true, 'Creado correctamente.', this.modalClose);

        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al crear.');
      }
    );
  }

  updateOfertaLaboral() {
    this.ofertalaburoService.updateOfertaLaboral(this.idEdit, this.obtenerDatosFormulario()).subscribe(
      result => {
        this.alertService.mostrarSweetAlert(true, 'Actualizado correctamente.', this.modalClose);
        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, `Error al actualizar: ${error.error.message})`);
      }
    );
  }



  listPostulantesActivos(idoferta: number | undefined) {
    this.selectedRows = [];
    this.ofertalaburoService.getGraduadosWithActivePostulationByOfertaLaboral(idoferta || 0).subscribe(
      graduados => {
        this.idOferta = idoferta || 0;
        this.allGraduados = graduados;

        this.existenPostulantes = this.allGraduados.length > 0;

        this.activeSelectPostulant = this.ofertaslaboraleslist.find(oferta => oferta.id === idoferta)?.estado === 'EN_SELECCION';
      }
    )
  }

  listPostulantesInactivos(idoferta: number | undefined) {
    this.selectedRows = [];
    this.ofertalaburoService.getGraduadosWithCancelPostulationByOfertaLaboral(idoferta || 0).subscribe(
      graduados => {
        this.idOferta = idoferta || 0;
        this.allGraduados = graduados;

        this.existenPostulantes = this.allGraduados.length > 0;
        this.activeSelectPostulant = false;
      }
    )
  }

  listPostulantesSeleccionados(idoferta: number | undefined) {
    this.selectedRows = [];
    this.ofertalaburoService.getGraduadosSeleccionadosByOfertaLaboral(idoferta || 0).subscribe(
      graduados => {
        this.idOferta = idoferta || 0;
        this.allGraduados = graduados;

        this.existenPostulantes = this.allGraduados.length > 0;
        this.activeSelectPostulant = false;
      }
    )
  }

  getFechaPublicacion() {
    const currentDate = new Date();

    // Obtener componentes de la fecha y hora
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // Formatear la fecha y hora en el formato requerido
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    if (this.editarClicked) {
      this.fechaPublicacion = new Date(formattedDate);
    } else {
      this.fechaPublicacion = new Date(formattedDate);
    }
  }

  getMisEmpresas(): void {
    this.empresaService.getEmpresasbyUser(this.name || "").subscribe((empresas) => {
      for (const empresa of empresas) {
        if (empresa.estado == true) {
          this.empresas.push(empresa);
        }
      }
    });
  }

  showEditDeleteButtons(oferta: ofertaLaboralDTO): boolean {

    return new Date(oferta.fechaCierre) > this.fechaActual;
  }

  setIDGraduado(id: number | undefined = 0) {
    localStorage.setItem('idGraduado', id.toString());
  }

  sendSelectedIDs() {
    this.selectedIDs = this.allGraduados
      .filter((graduado, index) => this.selectedRows[index])
      .map(graduado => graduado.id)
      .filter(id => id !== undefined) as number[];
  }
  selectedOption: string = 'no';
  updateFechaPublicacion(): void {
    if (this.editarClicked && this.selectedOption === 'si') {
      this.getFechaPublicacion();
    }
  }
  seleccionarPostulantes() {
    this.sendSelectedIDs();
    this.postulacionService.selectPostulants(this.idOferta, this.selectedIDs).subscribe(
      () => {
        this.alertService.mostrarSweetAlert(true, 'Postulante/es seleccionados correctamente.');
        this.listPostulantesActivos(this.idOferta);
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al seleccionar postulantes.');
        console.error('Error al seleccionar postulantes:', error);
      }
    );
  }

  filtroPostulados() {

    if (this.filtropostulados == 1) {
      this.listPostulantesActivos(this.idOferta);
    } else if (this.filtropostulados == 2) {
      this.listPostulantesInactivos(this.idOferta);
    } else if (this.filtropostulados == 3) {
      this.listPostulantesSeleccionados(this.idOferta);
    }
  }

  deleteOfertaLaboral(id: number | undefined = 0, estado: string = 'CANCELADA') {
    // Mostrar SweetAlert de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ofertalaburoService.cancelarOReactivarOfertaLaboral(id, estado).subscribe(
          () => {
            this.alertService.mostrarSweetAlert(true, 'La oferta laboral se ha cancelado y notificado a los postulantes.');
            this.loadData();
          },
          error => {
            this.alertService.mostrarSweetAlert(false, 'No se pudo cancelar la oferta laboral..');
            console.error('Error al eliminar empresa:', error);
          }
        );
      }
    });
  }
}