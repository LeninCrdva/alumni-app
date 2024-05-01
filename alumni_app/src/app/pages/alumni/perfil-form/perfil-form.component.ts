import { Component, Renderer2, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Usuario } from '../../../data/model/usuario';
import { UserService } from '../../../data/service/UserService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../../data/service/PersonService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CiudadDTO } from '../../../data/model/DTO/ciudadDTO';
import { CiudadService } from '../../../data/service/ciudad.service';
import { GraduadoDTO } from '../../../data/model/DTO/GraduadoDTO';
import { GraduadoService } from '../../../data/service/graduado.service';
import { AssetService } from '../../../data/service/Asset.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ImageHandlerServiceFoto } from '../../../data/service/ImageHandlerServiceFoto';


@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css']
})
export class PerfilFormComponent implements AfterViewInit, OnInit {
  usuarioInfo: Usuario = new Usuario();
  graduadoInfo: GraduadoDTO = new GraduadoDTO();
  updatePersonForm: FormGroup;
  updateUbicacionForm: FormGroup;
  ciudades: CiudadDTO[] = []
  provincias: string[] = [];
  photoForm: FormGroup;
  rutaImagen: any;
  idUser: any;
  constructor(private renderer: Renderer2,
    private el: ElementRef,
    private userService: UserService,
    formBuilder: FormBuilder,
    private personaService: PersonaService,
    private router: Router,
    private ciudadService: CiudadService,
    private graduateService: GraduadoService,
    private assetService: AssetService,
    public imageHandlerService: ImageHandlerServiceFoto)  {
    this.updatePersonForm = formBuilder.group({
      primerNombre: ['', Validators.required],
      segundoNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    })

    this.updateUbicacionForm = formBuilder.group({
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required]
    })
    this.photoForm = formBuilder.group({
      photo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllInfoGraduate()
    this.getGraduadoDTOInfoAndCity()
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

  getAllInfoGraduate(): void {
    const userIdStorage = localStorage.getItem('name')
    this.idUser = localStorage.getItem('user_id');
    if (userIdStorage) {
      this.userService.getUserByUsername(userIdStorage).subscribe(
        user => {
          this.usuarioInfo = user;
          this.rutaImagen = user.urlImagen;
          this.imageHandlerService.getPrevisualizacion(this.rutaImagen);
          this.initializePersonForm()
        }
      )
    }
  }

  updateInfoGraduate() {
    Swal.fire({
      title: "¿Realmente deseas cambiar tus datos personales?",
      text: "Esta acción es irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, actualizar información!"
    }).then((result) => {
      if (result.isConfirmed && this.updatePersonForm.valid && this.updateUbicacionForm) {
        const formDataPerson = this.updatePersonForm.value;
        const ciudadSeleccionada = this.updateUbicacionForm.get('ciudad')?.value;
        const idUser = this.usuarioInfo.persona.id
        const idGraduado = this.graduadoInfo.id

        this.usuarioInfo.persona = {
          cedula: formDataPerson.cedula,
          primerNombre: formDataPerson.primerNombre,
          segundoNombre: formDataPerson.segundoNombre,
          fechaNacimiento: formDataPerson.fechaNacimiento,
          telefono: formDataPerson.telefono,
          apellidoPaterno: formDataPerson.primerApellido,
          apellidoMaterno: formDataPerson.segundoApellido
        }

        this.graduadoInfo.ciudad = ciudadSeleccionada;

        this.personaService.updatePerson(idUser, this.usuarioInfo.persona).subscribe(
          persona => {
            this.usuarioInfo.persona = persona;
            this.graduateService.updateGraduadoDTO(idGraduado, this.graduadoInfo).subscribe(async (data) => {
              Swal.fire({
                title: '¡Información actualizada!',
                text: 'Tu información se ha actualizado correctamente',
                icon: "success"
              });
              this.router.navigate(['system/alumni/perfil']);
            })
          }
        )
      }
    });
  }
  async updatePhoto() {
    if (this.imageHandlerService.archivos) {
      await this.uploadAndSetRutaImagen(this.imageHandlerService.archivos[0]);
      this.userService.updateUserPhoto(this.idUser, this.rutaImagen).subscribe();
      this.router.navigate(['system/alumni/perfil']);
    }
  }

  initializePersonForm(): void {
    this.updatePersonForm.patchValue({
      primerNombre: this.usuarioInfo.persona?.primerNombre,
      segundoNombre: this.usuarioInfo.persona?.segundoNombre,
      primerApellido: this.usuarioInfo.persona?.apellidoPaterno,
      segundoApellido: this.usuarioInfo.persona?.apellidoMaterno,
      cedula: this.usuarioInfo.persona?.cedula,
      telefono: this.usuarioInfo.persona?.telefono,
      fechaNacimiento: this.usuarioInfo.persona?.fechaNacimiento,
    });
  }

  initializeCityForm(): void {
    
    this.updateUbicacionForm.patchValue({
      ciudad: this.graduadoInfo.ciudad
    });

    this.onCiudadChange();
  }

  getGraduadoDTOInfoAndCity(): void {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      this.ciudadService.getCiudadesDTO().subscribe(data => {
        this.ciudades = data;
        this.graduateService.getGraduadoDTOByUserId(parseInt(userId)).subscribe(data => {
          this.graduadoInfo = data;
          this.initializeCityForm();
        })
      })
    }
  }

  onCiudadChange(): void {
    const ciudadSeleccionada = this.updateUbicacionForm.get('ciudad')?.value;

    this.provincias = this.ciudades
      .filter(ciudad => ciudad.nombre === ciudadSeleccionada)
      .map(ciudad => ciudad.provincia);

    this.updateUbicacionForm.get('provincia')?.setValue(this.provincias[0]);
  }

  onPhoneInput(event: any): void {
    const newValue = event.target.value.replace(/\D/g, ''); 
    this.updatePersonForm.controls['telefono'].setValue(newValue); 
  }

 
  onPhoneBlur(): void {
    this.updatePersonForm.controls['telefono'].markAsTouched(); 
  }

 
  isPhoneTouched(): boolean {
    return this.updatePersonForm.controls['telefono'].touched; 
  }
}