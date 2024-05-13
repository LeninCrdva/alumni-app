import { Component, Renderer2, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Usuario } from '../../../data/model/usuario';
import { Empresario } from '../../../data/model/empresario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../data/service/UserService';
import { PersonaService } from '../../../data/service/PersonService';
import { Router } from '@angular/router';
import { EmpresarioService } from '../../../data/service/empresario.service';
import Swal from 'sweetalert2';
import { ImageHandlerServiceFoto } from '../../../data/service/ImageHandlerServiceFoto';
import { AssetService } from '../../../data/service/Asset.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css']
})
export class PerfilFormComponent implements AfterViewInit, OnInit {
  usuarioInfo: Usuario = new Usuario();
  updateEmpresarioForm: FormGroup;
  photoForm: FormGroup;
  idUser: any;
  rutaImagen: any;
  provincias: string[] = [];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private userService: UserService,
    formBuilder: FormBuilder,
    private personaService: PersonaService,
    private router: Router,
    private empresarioService: EmpresarioService,
    private assetService: AssetService,
    public imageHandlerService: ImageHandlerServiceFoto) {
    this.updateEmpresarioForm = formBuilder.group({
      primerNombre: ['', Validators.required],
      segundoNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    })
    this.photoForm = formBuilder.group({
      photo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllInfoGraduate()
  }

  ngAfterViewInit() {
    const allIndicator = this.el.nativeElement.querySelectorAll('.indicator li') as NodeListOf<HTMLLIElement>;
    const allContent = this.el.nativeElement.querySelectorAll('.content li') as NodeListOf<HTMLLIElement>;

    allIndicator.forEach(item => {
      this.renderer.listen(item, 'click', () => {
        const content = this.el.nativeElement.querySelector(item.dataset['target']);

        if (content) {
          allIndicator.forEach(i => {
            this.renderer.removeClass(i, 'active');
          });

          allContent.forEach(i => {
            this.renderer.removeClass(i, 'active');
          });

          this.renderer.addClass(content, 'active');
          this.renderer.addClass(item, 'active');
        }
      });
    });
  }

  onFileSelected(event: any): void {
    this.imageHandlerService.capturarFile(event);
    this.imageHandlerService.previsualizacion;
  }


  deleteFile(rutakey: string) {
    this.assetService.delete(rutakey).subscribe(r => {
    })
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
      }
    } catch (error) {
    }
  }

  getAllInfoGraduate(): void {
    const userIdStorage = localStorage.getItem('name')
    this.idUser = localStorage.getItem('user_id');
    if (userIdStorage) {
      this.userService.getUserByUsername(userIdStorage).subscribe(
        user => {
          this.rutaImagen = user.urlImagen;
          this.imageHandlerService.getPrevisualizacion(this.rutaImagen);
          this.usuarioInfo = user; this.initializeForm()
        }
      )
    }
  }

  updateInfoEmpresario() {
    Swal.fire({
      title: "¿Realmente deseas cambiar tus datos personales?",
      text: "Esta acción es irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, actualizar información!"
    }).then((result) => {
      if (result.isConfirmed && this.updateEmpresarioForm.valid) {
        const formDataPerson = this.updateEmpresarioForm.value;
        const idUser = this.usuarioInfo.persona.id

        this.usuarioInfo.persona = {
          cedula: formDataPerson.cedula,
          primerNombre: formDataPerson.primerNombre,
          segundoNombre: formDataPerson.segundoNombre,
          fechaNacimiento: formDataPerson.fechaNacimiento,
          telefono: formDataPerson.telefono,
          apellidoPaterno: formDataPerson.primerApellido,
          apellidoMaterno: formDataPerson.segundoApellido
        }

        this.personaService.updatePerson(idUser, this.usuarioInfo.persona).subscribe(async (persona) => {
            this.usuarioInfo.persona = persona;
           
            Swal.fire({
              title: '¡Información actualizada!',
              text: 'Tu información se ha actualizado correctamente',
              icon: "success"
            });
            this.router.navigate(['system/company/perfil']);
          }
        )
      }
    });
  }

  initializeForm(): void {
    this.updateEmpresarioForm.patchValue({
      primerNombre: this.usuarioInfo.persona?.primerNombre,
      segundoNombre: this.usuarioInfo.persona?.segundoNombre,
      primerApellido: this.usuarioInfo.persona?.apellidoPaterno,
      segundoApellido: this.usuarioInfo.persona?.apellidoMaterno,
      cedula: this.usuarioInfo.persona?.cedula,
      telefono: this.usuarioInfo.persona?.telefono,
      fechaNacimiento: this.usuarioInfo.persona?.fechaNacimiento,
    });
  }

  async updatePhoto() {
    if (this.imageHandlerService.archivos) {
      await this.uploadAndSetRutaImagen(this.imageHandlerService.archivos[0]);
      this.userService.updateUserPhoto(this.idUser, this.rutaImagen).subscribe();
      this.router.navigate(['system/company/perfil']);
    }
  }
}
