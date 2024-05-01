import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GraduadoService } from '../../../data/service/graduado.service';
import { Graduado3 } from '../../../data/model/graduado';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ciudad } from '../../../data/model/ciudad';
import { CiudadService } from '../../../data/service/ciudad.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AssetService } from '../../../data/service/Asset.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-nuevo-graduado-modal',
  templateUrl: './nuevo-graduado-modal.component.html',
  styleUrl: './nuevo-graduado-modal.component.css'
})
export class NuevoGraduadoModalComponent implements OnInit {

  nuevoGraduadoForm: FormGroup = new FormGroup({});

  usuarioGuardado: string = localStorage.getItem('name') || '';
  ciudades: Ciudad[] = [];
  nuevoGraduado: Graduado3 = new Graduado3();
  archivoSeleccionado: File | null = null;
  public previsualizacion?: string;
  public archivos: any = []
  public loading?: boolean
  public rutaimagen: string = '';
  public urlImage: string = '';
  public username: string = '';
  public inforest: any = [];
  public getRuta: string = '';
  public mensajevalidado: string = '';
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private graduadoService: GraduadoService,
    private modalService: BsModalService,
    private ciudadService: CiudadService,
    private assetService: AssetService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.nuevoGraduado.usuario = this.usuarioGuardado;
    this.buildForm();
    this.nuevoGraduadoForm.get('usuario')?.setValue(this.usuarioGuardado);
    this.cargarCiudades();
  }

  buildForm() {
    this.nuevoGraduadoForm = this.fb.group({
      usuario: ['', Validators.required],
      emailPersonal: ['', Validators.required],
      ciudad: ['', Validators.required],
      fecha_graduacion: ['', Validators.required],
      estadoCivil: ['', Validators.required],
    });
  }

  cargarCiudades() {
    this.ciudadService.getCiudades().subscribe(
      (ciudades) => {
        this.ciudades = ciudades;
      },
      (error) => {
        console.error('Error al cargar las ciudades:', error);
      }
    );
  }
  //-----------------------Imagen--------------------------------------------------//

  capturarFile(event: any): void {
    const archivoCapturado = event.target.files[0];
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
    });
    this.archivos.push(archivoCapturado);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();

      reader.readAsDataURL($event);

      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };

      reader.onerror = error => {
        resolve({
          base: null
        });
      };
    } catch (e) {
      console.error('Error al extraer base64:', e);
      resolve({
        base: null
      });
    }
  });

  clearImage(): void {
    this.previsualizacion = '';
    this.archivos = [];
  }

  deleteFile(rutakey: string): void {
    this.assetService.delete(rutakey).subscribe(() => {
      console.log('Archivo eliminado');
    });
  }

  guardarGraduado(): void {
    if (this.nuevoGraduadoForm.valid && this.archivos.length > 0) {
      this.loading = true;
      const formularioDeDatos = new FormData();

      this.archivos.forEach((archivo: File) => {
        formularioDeDatos.append('multipartFile', archivo, archivo.name);
      });

      this.assetService.post(environment.apiURL+'/assets/upload', formularioDeDatos)
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.inforest = res;

            this.nuevoGraduado.usuario = this.nuevoGraduadoForm.get('usuario')?.value;
            this.nuevoGraduado.emailPersonal = this.nuevoGraduadoForm.get('emailPersonal')?.value;
            this.nuevoGraduado.ciudad = this.nuevoGraduadoForm.get('ciudad')?.value;
            this.nuevoGraduado.anioGraduacion = this.nuevoGraduadoForm.get('fecha_graduacion')?.value;
            this.nuevoGraduado.estadoCivil = this.nuevoGraduadoForm.get('estadoCivil')?.value;
            this.nuevoGraduado.urlPdf = res.url;
            this.nuevoGraduado.rutaPdf = res.key;
            this.graduadoService.createGraduado2(this.nuevoGraduado).subscribe(
              (res) => {

                Swal.fire({
                  icon: 'success',
                  text: 'Graduado creado exitosamente'
                });

                this.bsModalRef.hide();
              },
              (error) => {
                // Muestra un SweetAlert de error
                Swal.fire({
                  icon: 'error',
                  text: 'Error al crear graduado. Por favor, intenta nuevamente.'
                });
              }
            );



            this.bsModalRef.hide(); // Cierra el modal después de cargar los datos
          },
          (error) => {
            this.loading = false;
            console.error('Error al subir archivo:', error);
            alert('Error al subir archivo');
          }
        );
    } else {
      this.mensajevalidado = 'Error: no puede haber campos vacíos y asegúrate de seleccionar un archivo PDF.';
      console.error(this.mensajevalidado);
    }
  }

  cerrarModal(): void {
    if (this.nuevoGraduadoForm.valid) {
      this.bsModalRef.hide();
    } else {
      console.error('No se puede cerrar el modal. Verifica que todos los campos estén llenos.');
    }
  }
}