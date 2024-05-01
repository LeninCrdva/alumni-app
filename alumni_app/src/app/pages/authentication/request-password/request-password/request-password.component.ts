import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { MailRequest } from '../../../../data/model/Mail/MailRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailService } from '../../../../data/service/mail.service';
import Swal from 'sweetalert2';
import { AlertsService } from '../../../../data/Alerts.service';
@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrl: './request-password.component.css'
})
export class RequestPasswordComponent {
  options_request: AnimationOptions = {
    path: '../../../assets/anims/Anim_reset.json',
  };

  mailRequest: MailRequest = new MailRequest();
  formMail: FormGroup;

  constructor(
    private fb: FormBuilder,
    private mailService: MailService,
    private alertService: AlertsService
  ) {
    this.formMail = this.fb.group({
      email: ['', Validators.required]
    });
  }

  sendMail(): void {
    if (this.formMail.valid) {
      const emailRequest = this.formMail.value;
      let responseBack;

      this.mailRequest = {
        name: emailRequest.email,
        to: emailRequest.email,
        from: 'infoalumni@gmail.com',
        subject: 'Petición de cambio de contraseña',
        caseEmail: 'reset-password'
      }

      this.mailService.sendResetPassword(this.mailRequest).subscribe((response) => {
        this.alertService.mostrarSweetAlert(true, 'Se ha enviado un correo a su dirección de correo electrónico para restablecer su contraseña');
        this.formMail.reset();
      },
        (error) => {
          if (error.status === 404) {
            this.alertService.mostrarSweetAlert(false, 'Esta dirección de correo electrónico no está registrada en el sistema. Por favor, verifique que la dirección de correo electrónico sea correcta o contacte al administrador del sistema.');
          }

          if (error.status === 409) {
            this.alertService.mostrarSweetAlert(false, 'Usted ya cuenta con un correo de recuperación activo.');
          }
        }
      )
    }
  }
}
