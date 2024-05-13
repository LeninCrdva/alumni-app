import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { Empresa } from '../../../data/model/empresa';
import { Ciudad } from '../../../data/model/ciudad';
import { sectorempresarial } from '../../../data/model/sectorEmpresarial';
import { EmpresaService } from '../../../data/service/empresa.service';
import { CiudadService } from '../../../data/service/ciudad.service';
import { SectorEmpresarialService } from '../../../data/service/sectorempresarial.service';
import { EmpresarioService } from '../../../data/service/empresario.service';
import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PdfHandlerService } from '../../../data/service/pdfHandlerService.service';
import { AssetService } from '../../../data/service/Asset.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Subject, lastValueFrom } from 'rxjs';
import { ImageHandlerServiceFoto } from '../../../data/service/ImageHandlerServiceFoto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ValidatorEc } from '../../../data/ValidatorEc.service';
import { DataTableDirective } from 'angular-datatables';
import { AlertsService } from '../../../data/Alerts.service';
import { ValidatorsUtil } from '../../../components/Validations/ReactiveValidatorsRegEx';
import { EmpresaDTO } from '../../../data/model/DTO/EmpresaDTO';
import { FiltersService } from '../../../data/Filters.service';
import { DataTablesService } from '../../../data/DataTables.service';

@Component({
  selector: 'app-empresas-2',
  templateUrl: './empresas-2.component.html',
  styleUrls: ['./empresas-2.component.css']
})
export class Empresas2Component {
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
  empresas: Empresa[] = [];
  ciudades: Ciudad[] = [];
  sectoresEmpresariales: sectorempresarial[] = [];
  companyForm: FormGroup;
  // =====================================================
  //*                   VARIABLES
  // =======================================================
  editarClicked = false;
  showMessage = false;
  notActive = true;
  idEdit: number = 0;
  fileName!: string;
  companyUrl: SafeResourceUrl;
  empresariouser: string | undefined = '';
  idUser: number = parseInt(localStorage.getItem('idUser') || '0', 10);
  accionRealizada: boolean = false;
  
  rutaPdf: any;
  rutaImagen: any;
  
  constructor(
    public filterService: FiltersService,
    public dtService: DataTablesService,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef,
    public pdfHandlerService: PdfHandlerService,
    public imageHandlerService: ImageHandlerServiceFoto,
    private empresaService: EmpresaService,
    private ciudadService: CiudadService,
    private assetService: AssetService,
    private sectorempresarialService: SectorEmpresarialService,
    private serviceempresario: EmpresarioService,
    private sanitizer: DomSanitizer,
    private validatorEc: ValidatorEc,
    private fb: FormBuilder,
    private alertService: AlertsService,
    private renderer: Renderer2
  ) {
    this.companyForm = this.fb.group({
      nombre: ['', [Validators.required, this.validateUniqueName()]],
      ruc: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternRucValidator()), this.validateRuc(), this.validateUniqueRuc()]],
      tipoEmpresa: ['', Validators.required],
      razonSocial: ['', Validators.required],
      area: ['', Validators.required],
      ubicacion: ['', Validators.required],
      sitioWeb: ['', Validators.pattern(ValidatorsUtil.patternWebsiteValidator())],
      ciudad: [Validators.required],
      sectorEmpresarial: [Validators.required],

    });
    this.companyUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }
  
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  ngOnInit(): void {
    const columnTitles = ['#', 'Nombre', 'RUC', 'Razón social', 'Ubicación', 'Estado'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar empresa....');
    this.filterService.initializeDropdowns('filterTable', columnTitles);
    this.getAllCities();
    this.obtenerYAlmacenarUsuarioEmpresario();
    this.getSectoresEmpresariales();
  }

  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;

    this.idEdit = id || 0;

    const dataToEdit = this.empresas.find(empresa => empresa.id === this.idEdit);

    if (dataToEdit) {
      const ciudad = this.ciudades.find(c => c.id === dataToEdit.ciudad.id);
      const sectorEmpresarial = this.sectoresEmpresariales.find(s => s.id === dataToEdit.sectorEmpresarial.id);

      this.companyForm.patchValue({
        nombre: dataToEdit.nombre,
        ruc: dataToEdit.ruc,
        tipoEmpresa: dataToEdit.tipoEmpresa,
        razonSocial: dataToEdit.razonSocial,
        area: dataToEdit.area,
        ubicacion: dataToEdit.ubicacion,
        sitioWeb: dataToEdit.sitioWeb,
        ciudad: ciudad,
        sectorEmpresarial: sectorEmpresarial
      });

      this.pdfHandlerService.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataToEdit.urlPdfRuc ?? '');
    } else {
      console.error('No se puede obtener la empresa a editar.');
    }

    this.alertService.resetInputsValidations(this.renderer);

    this.idEdit = id;

    this.notActive = true;
  }

  onRegistrarClick(): void {
    this.companyForm.reset();

    this.alertService.resetInputsValidations(this.renderer);

    this.pdfHandlerService.clearPdf();

    this.editarClicked = false;
  }
  
  onPdfSelected(event: any): void {
    this.pdfHandlerService.handlePdfFile(event);
    this.pdfHandlerService.pdfUrl;
    this.notActive = false;
  }

  obtenerYAlmacenarUsuarioEmpresario(): void {
    this.serviceempresario.getEmpresario().subscribe(
      empresario => {
        if (empresario?.usuario !== undefined) {
          localStorage.setItem('empresariouser', empresario.usuario);
          const storedEmpresariouser = localStorage.getItem('empresariouser');

          this.cd.detectChanges();

          if (storedEmpresariouser !== null) {
            this.empresariouser = storedEmpresariouser.toUpperCase();

          } else {
            console.log('No hay usuario');
          }
        }

        this.buscarEmpresas();
      },
      error => console.error('Error al obtener el empresario:', error)
    );
  }

  async uploadAndSetRutaImagen(file: File, type: string = 'image') {
    try {
      const observable = this.assetService.upload(file);
      const data: HttpEvent<any> | undefined = await lastValueFrom(observable);

      if (type === 'image') {
        if (data instanceof HttpResponse) {
          const key = data.body?.key;
          this.rutaImagen = key;
        }
      } else {
        if (data instanceof HttpResponse) {
          const key = data.body?.key;
          this.rutaPdf = key;
          this.fileName = key;
        }
      }
    } catch (error) {
      //console.error('Error al subir la imagen:', error);
    }
  }

  onSubmit() {

    if (!this.companyForm.valid) {
      this.alertService.mostrarSweetAlert(false, 'Por favor, revise los campos nuevamente antes de enviar.');
      this.alertService.showInputsValidations(this.renderer);
      return;
    }

    if (this.editarClicked) {
      this.editarEmpresa();
    } else {
      this.crearEmpresa();
    }
  }

  getCompanyData(): EmpresaDTO {
    const formData = this.companyForm.value;
    let company: EmpresaDTO = {
      empresario: this.empresariouser ? this.empresariouser : '',
      ciudad: formData.ciudad,
      sectorEmpresarial: formData.sectorEmpresarial,
      ruc: formData.ruc,
      nombre: formData.nombre,
      tipoEmpresa: formData.tipoEmpresa,
      razonSocial: formData.razonSocial,
      area: formData.area,
      ubicacion: formData.ubicacion,
      sitioWeb: formData.sitioWeb,
      estado: false,
      rutaPdfRuc: this.fileName,
    };

    return company;
  }

  async crearEmpresa() {

    if (!this.editarClicked && !this.pdfHandlerService.pdfFile) {
      Swal.fire({
        icon: 'error',
        title: '¡Upps!',
        text: 'Por favor, seleccione un archivo PDF.',
      });
      return;
    }
    
    await this.uploadAndSetRutaImagen(this.pdfHandlerService.pdfFile[0], 'pdf');

    let empresa: EmpresaDTO = this.getCompanyData();

    this.empresaService.createEmpresa(empresa).subscribe(
      empresa => {
        this.alertService.mostrarSweetAlert(true, 'La empresa se ha guardado exitosamente.');
        
        this.buscarEmpresas();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Hubo un error al intentar guardar la Empresa.');
      }
    );
  }


  editarEmpresa() {

    this.empresaService.updateEmpresa(this.idEdit, this.getCompanyData()).subscribe(
      empresa => {
        this.alertService.mostrarSweetAlert(true, 'La empresa se ha actualizado exitosamente.', this.modalClose);
        this.buscarEmpresas();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Hubo un error al intentar actualizar la Empresa.');
      }
    );
  }

  deleteEmpresa(id: number | undefined = 0) {
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
        this.empresaService.deleteEmpresa(id).subscribe(
          response => {
            this.obtenerYAlmacenarUsuarioEmpresario();

            this.alertService.mostrarSweetAlert(true, 'La empresa se ha eliminado exitosamente.');
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'Hubo un error al intentar eliminar la empresa.',
            });
            console.error('Error al eliminar empresa:', error);
          }
        );
      }
    });
  }

  getAllCities() {
    this.ciudadService.getCiudades().subscribe(
      (ciudades) => { this.ciudades = ciudades },
    );
  }

  getSectoresEmpresariales() {
    this.sectorempresarialService.getSectoresEmpresariales().subscribe(
      sectores => this.sectoresEmpresariales = sectores,
      error => console.error(error)
    );
  }

  buscarEmpresas() {
    if (!this.empresariouser) {
      console.error('Error: No hay usuario empresario definido.', this.empresariouser);
      return;
    }

    this.empresaService.getEmpresasbyUser(this.empresariouser).subscribe(
      empresas => {
        if (Array.isArray(empresas) && empresas.length > 0) {
          this.empresas = empresas.sort((a, b) => {
            if (a.id !== undefined && b.id !== undefined) {
              return a.id - b.id;
            }
            return 0;
          });
        }

        if (this.initializeTable) {
          this.dtTrigger.next(null);
          this.initializeTable = false;
        } else {
          this.dtService.rerender(this.dtElement, this.dtTrigger);
        }
      },
      error => {
        console.error('Error al obtener empresas:', error);
        if (error.status === 400) {
          console.error('Error 400: La solicitud es incorrecta.');
        } else if (error.status === 500) {
          console.error('Error 500: Error interno del servidor.');
        }
      }
    );
  }

  public sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async updatePdfRuc() {
    this.notActive = false;
    if (this.imageHandlerService.archivos) {
      await this.uploadAndSetRutaImagen(this.pdfHandlerService.pdfFile[0], 'pdf');
      if (this.rutaPdf) {
        this.empresaService.updatePdfRuc(this.idEdit, this.fileName).subscribe(
          empresa => {
            this.alertService.mostrarSweetAlert(true, 'El PDF se ha actualizado exitosamente.');
            
            this.buscarEmpresas();
            
            this.pdfHandlerService.clearPdf();
          }
        );
      }
    }
  }

  disableButton() {
    this.notActive = true;
  }

  validateRuc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ruc = control.value;
      return !ruc ? null: this.validatorEc.validarRucSociedadPrivada(ruc) || this.validatorEc.validarRucPersonaNatural(ruc) || this.validatorEc.validarRucSociedadPublica(ruc) ? null : { invalidRuc: true };
    };
  }

  validateUniqueRuc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ruc = control.value;

      if (this.editarClicked) {
        if (ruc) {
          let empresa = this.empresas.find(e => e.ruc === ruc);
          if (empresa?.ruc === ruc){
            return null;
          } else {
            return !ruc ? null: this.empresas.find(e => e.ruc === ruc) ? { rucExists: true } : null;
          }
        }
      }
      return !ruc ? null: this.empresas.find(e => e.ruc === ruc) ? { rucExists: true } : null;
    };
  }

  validateUniqueName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value;
      if (this.editarClicked) {
        if (name) {
          let empresa = this.empresas.find(e => e.nombre === name);
          if (empresa?.nombre === name){
            return null;
          } else {
            return !name ? null: this.empresas.find(e => e.nombre === name) ? { nameExists: true } : null;
          }
        }
      }
      return !name ? null: this.empresas.find(e => e.nombre === name.toUpperCase()) ? { nameExists: true } : null;
    };
  }
}