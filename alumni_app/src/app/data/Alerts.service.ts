import { Injectable, EventEmitter, Renderer2 } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertsService {
    onClose: EventEmitter<string> = new EventEmitter();

    constructor() { }

    mostrarSweetAlert(esExitoso: boolean, mensaje: string, modalClose: any = null): void {
        const titulo = esExitoso ? 'Completado exitosamente' : 'Se ha producido un error';

        Swal.fire({
            icon: esExitoso ? 'success' : 'error',
            title: titulo,
            text: mensaje,
            allowOutsideClick: !esExitoso,
        }).then((result) => {
            if (esExitoso || result.isConfirmed) {
                this.onClose.emit(esExitoso ? 'guardadoExitoso' : 'errorGuardado');
                modalClose?.nativeElement.click();
            }
        });
    }

    mostrarAlertaSweet(mensaje: string = 'Por favor, completa todos los formularios!'): void {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-warning'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: 'Completa toda la información requerida!',
            text: mensaje,
            icon: 'warning',
            confirmButtonText: 'OK!',
            backdrop: `rgba(202, 148, 97,0.3)`
        });
    }

    detenerAlertaCargando(): void {
        Swal.close();
    }

    mostrarAlertaCargando(mensaje: string = 'Cargando...'): void {
        Swal.fire({
            title: mensaje,
            html: 'Por favor, espera...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    }

    mostrarAlertaMomentanea(mensaje: string, isSuccesIcon: boolean = true): void {
        Swal.fire({
            position: "top",
            icon: (isSuccesIcon) ? "success" : "error",
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
        });
    }

    public adjustFieldValidators(form: FormGroup, fieldName: string, requiresValidation: boolean): void {
        if (requiresValidation) {
            form.get(fieldName)?.setValidators(Validators.required);
        } else {
            form.get(fieldName)?.clearValidators();
        }
        form.get(fieldName)?.updateValueAndValidity();
    }

    resetInputsValidations(renderer: Renderer2): void {
        const form = document.querySelector('.was-validated');

        if (form && form.classList.contains('was-validated')) {
            renderer.removeClass(form, 'was-validated');
            renderer.addClass(form, 'needs-validation');
        }
    }

    showInputsValidations(renderer: Renderer2): void {
        const form = document.querySelector('.needs-validation');

        if (form && form.classList.contains('needs-validation')) {
            renderer.removeClass(form, 'needs-validation');
            renderer.addClass(form, 'was-validated');
        }
    }
}
