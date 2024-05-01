import { Component, EventEmitter, Output } from '@angular/core';
import { Empresa } from '../../../data/model/empresa';
import { Ciudad } from '../../../data/model/ciudad';
import { sectorempresarial } from '../../../data/model/sectorEmpresarial';
import { EmpresaService } from '../../../data/service/empresa.service';
import { CiudadService } from '../../../data/service/ciudad.service';
import { SectorEmpresarialService } from '../../../data/service/sectorempresarial.service';
import { EmpresarioService } from '../../../data/service/empresario.service';
import { Provincia } from '../../../data/model/provincia';
import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { PdfHandlerService } from '../../../data/service/pdfHandlerService.service';
import { AssetService } from '../../../data/service/Asset.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ImageHandlerServiceFoto } from '../../../data/service/ImageHandlerServiceFoto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ValidatorEc } from '../../../data/ValidatorEc.service';

@Component({
  selector: 'app-empresas-2',
  templateUrl: './empresas-2.component.html',
  styleUrls: ['./empresas-2.component.css']
})
export class Empresas2Component {

  editarClicked = false;
  idEdit: number = 0;
  fileName!: string;
  notActive = true;

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;
    this.idEdit = id || 0;
    this.getEmpresaById(this.idEdit);

  }

  onRegistrarClick(): void {
    this.pdfHandlerService.pdfUrl = '';
    this.editarClicked = false;
  }

  idUser: number = parseInt(localStorage.getItem('idUser') || '0', 10);
  public empresariouser: string | undefined = '';
  ciudadSeleccionada: any = {};
  sectorSeleccionado: any = {};
  empresass: Empresa[] = [];
  empresanueva: any = {};
  empresacargar: any = {};
  ciudades: Ciudad[] = [];
  sectoresEmpresariales: sectorempresarial[] = [];
  companyUrl: SafeResourceUrl;
  ID_Ciudad: number | undefined;
  ID_Sector: number | undefined;

  @Output() onClose: EventEmitter<string> = new EventEmitter();


  constructor(
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
    private validatorEc: ValidatorEc
  ) {
    this.companyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.empresacargar.rutaPdfRuc ?? '');
  }
  closeModal2(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.parentNode?.removeChild(modalBackdrop);
      }
    }
  }

  ngOnInit(): void {
    this.ciudadSeleccionada = {
      id: 0,
      nombre: '',
      provincia: new Provincia(),
    }
    this.sectorSeleccionado = {
      id: 0,
      nombre: '',
      descripcion: '',
    }
    this.empresanueva = {
      empresario: '',
      ciudad: new Ciudad(),
      sectorEmpresarial: new sectorempresarial(),
      ruc: '',
      nombre: '',
      tipoEmpresa: '',
      razonSocial: '',
      area: '',
      ubicacion: '',
      sitioWeb: '',

    };
    this.empresacargar = {
      empresario: '',
      ciudad: new Ciudad(),
      sectorEmpresarial: new sectorempresarial(),
      ruc: '',
      nombre: '',
      tipoEmpresa: '',
      razonSocial: '',
      area: '',
      ubicacion: '',
      sitioWeb: '',

    };

    this.getCiudadIDName();
    this.obtenerYAlmacenarUsuarioEmpresario();
    this.getSectoresEmpresariales();
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

  accionRealizada: boolean = false;
  mostrarSweetAlert(esExitoso: boolean, mensaje: string) {
    const titulo = esExitoso ? 'Completado exitosamente' : 'Se ha producido un error';

    Swal.fire({
      icon: esExitoso ? 'success' : 'error',
      title: titulo,
      text: mensaje,
      allowOutsideClick: !esExitoso,
    }).then((result) => {
      if (esExitoso || result.isConfirmed) {
        this.onClose.emit(esExitoso ? 'guardadoExitoso' : 'errorGuardado');
        this.bsModalRef.hide();
        this.closeModal2('m_modal_4');

        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.obtenerYAlmacenarUsuarioEmpresario();
      }
    });
  }

  validateEmpresasPerFields(): boolean {
    if (!this.empresanueva.ruc || !this.empresanueva.nombre || !this.empresanueva.tipoEmpresa || !this.empresanueva.razonSocial || !this.empresanueva.area || !this.empresanueva.ubicacion || !this.empresanueva.ciudad || !this.empresanueva.sectorEmpresarial) {
      return false;
    }

    return true;
  }

  validateEmpresasPerFieldsEdicion(): boolean {
    if (!this.empresacargar.ruc || !this.empresacargar.nombre || !this.empresacargar.tipoEmpresa || !this.empresacargar.razonSocial || !this.empresacargar.area || !this.empresacargar.ubicacion || !this.empresacargar.ciudad || !this.empresacargar.sectorEmpresarial) {
      return false;
    }

    return true;
  }
  rutaPdf: any;
  rutaImagen: any;
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



  crearEmpresa() {
    console.log(this.pdfHandlerService.pdfUrl);
    if (!this.validateEmpresasPerFields()) {
      this.mostrarSweetAlert(false, 'Por favor, completa todos los campos son obligatorios.');
      return;
    }
    if (this.imageHandlerService.archivos) {

      this.uploadAndSetRutaImagen(this.pdfHandlerService.pdfFile[0], 'pdf');
    }

    if (this.empresanueva) {
      this.empresanueva.rutaPdfRuc = this.rutaPdf;
      this.empresanueva.empresario = this.empresariouser;
      this.empresanueva.urlPdfRuc = '';
      //console.log(this.empresanueva);
      if (this.validarCampos()) {
        this.empresaService.createEmpresa(this.empresanueva).subscribe(
          empresa => {
            this.mostrarSweetAlert(true, 'La empresa se ha guardado exitosamente.');
            this.empresanueva = this.createEmpresaVacia();
            this.bsModalRef.hide();
            this.onClose.emit('guardadoExitoso');
          },
          error => {
            this.mostrarSweetAlert(false, 'Hubo un error al intentar guardar la Empresa.');
          }
        );
      } else {

        Swal.fire({
          icon: 'error',
          title: '¡Upps!',
          text: 'Hay campos que debe corregir para poder completar la acción.',
        });
      }
    }
  }


  editarEmpresa() {
    if (!this.empresacargar) {
      console.error('Error: this.empresacargar es null o undefined.');
      return;
    }

    if (this.idEdit <= 0) {
      console.error('Error: this.idEdit no es un valor válido.');
      return;
    }

    if (!this.validateEmpresasPerFieldsEdicion()) {
      this.mostrarSweetAlert(false, 'Por favor, completa todos los campos son obligatorios.');
      return;
    }

    this.editarClicked = true;

    this.empresacargar.empresario = this.empresariouser;
    if (this.validarCampos()) {
      this.empresaService.updateEmpresa(this.idEdit, this.empresacargar).subscribe(
        empresaActualizada => {
          this.mostrarSweetAlert(true, 'La empresa se ha actualizado exitosamente.');
          this.empresacargar = this.createEmpresaVacia();

          this.bsModalRef.hide();
          this.onClose.emit('actualizacionExitosa');
          this.obtenerYAlmacenarUsuarioEmpresario();
          this.editarClicked = false;

        }
      );
    } else {

      Swal.fire({
        icon: 'error',
        title: '¡Upps!',
        text: 'Hay campos que debe corregir para poder completar la acción.',
      });
    }
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
            Swal.fire({
              icon: 'success',
              title: 'Eliminado exitosamente',
              text: response,
            });
            this.obtenerYAlmacenarUsuarioEmpresario();
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

  getCiudadIDName() {
    this.ciudadService.getCiudades().subscribe(
      ciudades => this.ciudades = ciudades,

      error => console.error(error)

    );
  }


  getSectoresEmpresariales() {
    this.sectorempresarialService.getSectoresEmpresariales().subscribe(
      sectores => this.sectoresEmpresariales = sectores,
      error => console.error(error)
    );
  }

  buscarCiudad(id: number | undefined) {
    this.ciudadService.getCiudadById(id).subscribe(
      ciudad => {
        if (ciudad) {

          if (this.editarClicked) {

            this.empresacargar.ciudad = ciudad;

          } else {
            this.empresanueva.ciudad = ciudad;

          }
        } else {
          console.log('No se puede obtener la ciudad');
        }
      },
      error => console.error(error)
    );
  }


  buscarSector(id: number | undefined) {
    this.sectorempresarialService.getSectorEmpresarialById(id).subscribe(
      sector => {
        if (sector) {

          if (this.editarClicked) {
            this.empresacargar.sectorEmpresarial = sector;

          } else {
            this.empresanueva.sectorEmpresarial = sector;

          }
        } else {
          console.log('No se puede obtener el sector');
        }
      },
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
          this.empresass = empresas.sort((a, b) => {
            if (a.id !== undefined && b.id !== undefined) {
              return a.id - b.id;
            }
            return 0;
          });
          console.log('Empresas obtenidas exitosamente:', empresas);
        } else {
          console.error('Error: No se encontraron empresas para el usuario.');
        }
      },
      error => {
        console.error('Error al obtener empresas:', error);
        if (error.status === 400) {
          console.error('Error 400: La solicitud es incorrecta.');
        } else if (error.status === 500) {
          console.error('Error 500: Error interno del servidor.');
        } // Agrega más casos según sea necesario
      }
    );
  }
  // Método para sanitizar la URL
  public sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getEmpresaById(id: number) {
    this.empresaService.getEmpresaById(id).subscribe(
      empresa => {
        this.empresacargar = empresa;
        let urlPdf = this.sanitizer.bypassSecurityTrustResourceUrl(empresa.urlPdfRuc ?? '');
        console.log('URL PDF:', urlPdf);
        this.pdfHandlerService.pdfUrl = urlPdf;
        this.companyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(empresa.rutaPdfRuc ?? '');
        this.ID_Sector = empresa.sectorEmpresarial.id;
        this.ID_Ciudad = empresa.ciudad.id;
      });
  }

  async updatePdfRuc() {
    if (this.imageHandlerService.archivos) {
      this.notActive = false;
      await this.uploadAndSetRutaImagen(this.pdfHandlerService.pdfFile[0], 'pdf');
      if (this.rutaPdf) {
        this.empresaService.updatePdfRuc(this.idEdit, this.fileName).subscribe(
          empresa => {
            this.mostrarSweetAlert(true, 'El PDF se ha actualizado exitosamente.');
            console.log('PDF actualizado:', empresa);
          }
        );
      }
    }
  }

  disableButton() {
    this.notActive = true;
  }

  private createEmpresaVacia(): Empresa {
    return {
      id: 0,
      empresario: '',
      ciudad: new Ciudad(),
      sectorEmpresarial: new sectorempresarial(),
      ruc: '',
      nombre: '',
      tipoEmpresa: '',
      razonSocial: '',
      area: '',
      ubicacion: '',
      sitioWeb: ''
    };
  }

  @ViewChild('nombreInput', { read: NgModel }) nombreInput!: NgModel;
  @ViewChild('rucInput', { read: NgModel }) rucInput!: NgModel;
  @ViewChild('TipoEmpresaInput', { read: NgModel }) TipoEmpresaInput!: NgModel;
  @ViewChild('razonSocialInput', { read: NgModel }) razonSocialInput!: NgModel;
  @ViewChild('areaInput', { read: NgModel }) areaInput!: NgModel;
  @ViewChild('ubicacionInput', { read: NgModel }) ubicacionInput!: NgModel;
  //@ViewChild('sitioWebInput', { read: NgModel }) sitioWebInput!: NgModel;
  @ViewChild('ciudadInput', { read: NgModel }) ciudadInput!: NgModel;
  @ViewChild('sectorInput', { read: NgModel }) sectorInput!: NgModel;
  validarCampos(): boolean {
    const isNombreValido =
      !(
        this.nombreInput?.invalid &&
        (this.nombreInput?.dirty || this.nombreInput?.touched)
      );

    //console.log("¿Nombre válido?", isNombreValido ? "Sí" : "No");

    const isRucValido =
      !(
        this.rucInput?.invalid &&
        (this.rucInput?.dirty || this.rucInput?.touched)
      );

    //console.log("¿RUC válido?", isRucValido ? "Sí" : "No");

    const isTipoEmpresaValido =
      !(
        this.TipoEmpresaInput?.invalid &&
        (this.TipoEmpresaInput?.dirty || this.TipoEmpresaInput?.touched)
      );

    //console.log("¿Tipo de Empresa válido?", isTipoEmpresaValido ? "Sí" : "No");

    const isRazonSocialValida =
      !(
        this.razonSocialInput?.invalid &&
        (this.razonSocialInput?.dirty || this.razonSocialInput?.touched)
      );

    //console.log("¿Razón Social válida?", isRazonSocialValida ? "Sí" : "No");

    const isAreaValida =
      !(
        this.areaInput?.invalid &&
        (this.areaInput?.dirty || this.areaInput?.touched)
      );

    //console.log("¿Área válida?", isAreaValida ? "Sí" : "No");

    const isUbicacionValida =
      !(
        this.ubicacionInput?.invalid &&
        (this.ubicacionInput?.dirty || this.ubicacionInput?.touched)
      );

    //console.log("¿Ubicación válida?", isUbicacionValida ? "Sí" : "No");

    /* const isSitioWebValido =
       !(
         this.sitioWebInput?.invalid &&
         (this.sitioWebInput?.dirty || this.sitioWebInput?.touched)
       );*/

    //console.log("¿Sitio Web válido?", isSitioWebValido ? "Sí" : "No");

    const isCiudadValida =
      !(
        this.ciudadInput?.invalid &&
        (this.ciudadInput?.dirty || this.ciudadInput?.touched)
      );

    //console.log("¿Ciudad válida?", isCiudadValida ? "Sí" : "No");

    const isSectorValido =
      !(
        this.sectorInput?.invalid &&
        (this.sectorInput?.dirty || this.sectorInput?.touched)
      );

    //console.log("¿Sector válido?", isSectorValido ? "Sí" : "No");

    const isValid = isNombreValido && isRucValido && isTipoEmpresaValido && isRazonSocialValida && isAreaValida && isUbicacionValida && isCiudadValida && isSectorValido;

    console.log("¿Campos válidos?", isValid ? "Sí" : "No");

    return isValid;
  }

  validateRuc(ruc: string): boolean {
    return this.validatorEc.validarRucSociedadPrivada(ruc) || 
           this.validatorEc.validarRucPersonaNatural(ruc) || 
           this.validatorEc.validarRucSociedadPublica(ruc);
  }
}