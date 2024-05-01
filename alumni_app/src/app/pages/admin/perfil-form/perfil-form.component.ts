import { Component, Renderer2, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../data/service/UserService';
import { PersonaService } from '../../../data/service/PersonService';
import { AdministradorService } from '../../../data/service/administrador.service';
import Swal from 'sweetalert2';
import { Persona } from '../../../data/model/persona';
import { ImageHandlerServiceFoto } from '../../../data/service/ImageHandlerServiceFoto';
import { ValidatorsUtil } from '../../../components/Validations/ReactiveValidatorsRegEx';
import { fechaNacimientoValidator } from '../../authentication/register/fechaNacimientoValidator';
import { DataValidationService } from '../../../data/service/data-validation.service';
import { AssetService } from '../../../data/service/Asset.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css']
})
export class PerfilFormComponent implements OnInit, AfterViewInit {

  updateAdminDataForm: FormGroup;
  photoForm: FormGroup;
  adminInfo: any;
  pureInfo: any;
  idUser: any;
  rutaImagen: any;
  person: Persona = new Persona();

  constructor(private renderer: Renderer2, private el: ElementRef,
    private userService: UserService,
    formBuilder: FormBuilder,
    private personaService: PersonaService,
    private adminService: AdministradorService,
    public imageHandlerService: ImageHandlerServiceFoto,
    private dataValidationService: DataValidationService,
    private assetService: AssetService,
    private router: Router,
  ) {

    this.updateAdminDataForm = formBuilder.group({
      primerNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      segundoNombre: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      apellidoPaterno: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      apellidoMaterno: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patternOnlyLettersValidator())]],
      cedula: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator())]],
      telefono: ['', [Validators.required, Validators.pattern(ValidatorsUtil.patterOnlyNumbersValidator())]],
      fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator()]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.photoForm = formBuilder.group({
      photo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAdminInfo();
  }

  getAdminInfo() {
    const userIdStorage = localStorage.getItem('name');
    this.idUser = localStorage.getItem('user_id');
    if (userIdStorage !== null) {
      this.userService.getUserByUsername(userIdStorage).subscribe(data => {
        this.adminInfo = data;
        this.rutaImagen = this.adminInfo.urlImagen;
        this.imageHandlerService.getPrevisualizacion(this.rutaImagen);
        this.getadminInfoById();
      });
    }
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

  getadminInfoById() {
    this.adminService.getAdministradorByUserId(this.adminInfo.id).subscribe(data => {
      this.pureInfo = data;
      this.patchAdminData();
    });
  }

  patchAdminData() {
    this.updateAdminDataForm.patchValue({
      primerNombre: this.adminInfo.persona.primerNombre,
      segundoNombre: this.adminInfo.persona.segundoNombre,
      apellidoPaterno: this.adminInfo.persona.apellidoPaterno,
      apellidoMaterno: this.adminInfo.persona.apellidoMaterno,
      cedula: this.adminInfo.persona.cedula,
      telefono: this.adminInfo.persona.telefono,
      fechaNacimiento: this.adminInfo.persona.fechaNacimiento,
      email: this.pureInfo.email,
    });
  }

  updateAdminData() {
    if (this.updateAdminDataForm.valid) {
      this.person = this.updateAdminDataForm.value;
      this.pureInfo.email = this.updateAdminDataForm.value.email;
      const id = this.adminInfo.persona.id;
      this.personaService.updatePerson(id, this.person).subscribe(() => {
        this.adminService.updateAdministrador(this.pureInfo.id, this.pureInfo).subscribe(async () => {
          Swal.fire({
            title: 'Datos actualizados',
            icon: 'success',
            text: 'Los datos han sido actualizados correctamente',
            confirmButtonText: 'Aceptar',
            timer: 1500
          })
          this.router.navigate(['system/admin/perfil-admin']);
        });
      });
    } else {
      Object.values(this.updateAdminDataForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  async updatePhoto() {
    if (this.imageHandlerService.archivos) {
      await this.uploadAndSetRutaImagen(this.imageHandlerService.archivos[0]);
      this.userService.updateUserPhoto(this.idUser, this.rutaImagen).subscribe();
      this.router.navigate(['system/admin/perfil-admin']);
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

  duplicatedFields: { [key: string]: boolean } = {
    identityCard: false,
    phone: false,
    adminEmail: false
  };

  validateUniqueIdentityCard(): void {
    if (this.updateAdminDataForm.get('cedula')?.valid) {
      const currentIdentityCard = this.adminInfo.persona.cedula;
      const identityCard = this.updateAdminDataForm.get('cedula')?.value;
      if (identityCard !== currentIdentityCard) {
        this.dataValidationService.validateIdentityCard(identityCard).subscribe(res => {
          this.duplicatedFields['identityCard'] = res;
        });
      } else {
        this.duplicatedFields['identityCard'] = false;
      }
    }
  }

  validatePhone(): void {
    if (this.updateAdminDataForm.get('telefono')?.valid) {
      const currentPhone = this.adminInfo.persona.telefono;
      const phone = this.updateAdminDataForm.get('telefono')?.value;
      if (phone !== currentPhone) {
        this.dataValidationService.validatePhone(phone).subscribe(res => {
          this.duplicatedFields['phone'] = res;
        });
      } else {
        this.duplicatedFields['phone'] = false;
      }
    }
  }

  validateAdminEmail(): void {
    if (this.updateAdminDataForm.get('email')?.valid) {
      const currentEmail = this.pureInfo.email;
      const email = this.updateAdminDataForm.get('email')?.value;
      if (email !== currentEmail) {
        this.dataValidationService.validateAdminEmail(email).subscribe(res => {
          this.duplicatedFields['adminEmail'] = res;
        });
      } else {
        this.duplicatedFields['adminEmail'] = false;
      }
    }
  }

  isSaveButtonDisabled(): boolean {
    return Object.values(this.duplicatedFields).some(value => value);
  }

}
