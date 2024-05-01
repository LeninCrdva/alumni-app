import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from '../../../../data/service/AuthService';
import { RecoveryDTO } from '../../../../data/model/Mail/RecoveryDTO';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  options_reset: AnimationOptions = {
    path: '../../../assets/anims/Animation_password.json',
  };

  resetForm: FormGroup;
  fieldTextType: boolean = false;
  isActive: boolean = false;
  newReset: RecoveryDTO = new RecoveryDTO();
  reset_token?: string;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    this.isActive = !this.isActive;
  }

  resetPassword() {
    if (this.resetForm.valid) {
      this.route.queryParams.subscribe(params => {
        this.reset_token = params['reset_token'];

        const resetRequest = this.resetForm.value;

        if (this.reset_token) {
          this.newReset = {
            token: this.reset_token,
            newPassword: resetRequest.password
          }

          this.authService.resetPassword(this.newReset).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Contraseña restablecida',
                text: 'Su contraseña ha sido restablecida con éxito'
              });
              this.resetForm.reset();
              this.router.navigateByUrl('/account/login');
            },
            (error: HttpErrorResponse) => {
              this.selectMessageError(error);
            }
          );
        }
      });
    }
  }

  selectMessageError(error: HttpErrorResponse){
    let messageError = error.error.message;
    const titleError = 'Error al restablecer la contraseña';
    switch (error.status) {
      case 404:
        messageError = 'La petición hecha no es válida. Por favor, solicite un nuevo enlace de restablecimiento.';
        break;
      case 403:
        messageError = 'La solicitud ya no está activa. Por favor, solicite un nuevo enlace de restablecimiento.';
        break;
      case 410:
        messageError = 'Este link ya ha expirado. Por favor, solicite un nuevo enlace de restablecimiento.';
        break;
      default:
        messageError = 'Ha ocurrido un error al intentar restablecer la contraseña. Por favor, inténtelo de nuevo más tarde.';
        break;
    }

    this.showSwalError(messageError, titleError);
  }

  showSwalError(messageError: string, titleError: string):void {
    Swal.fire({
      icon: 'error',
      title: titleError,
      text: messageError
    });
  }
}