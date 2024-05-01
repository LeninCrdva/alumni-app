import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { AlertsService } from '../Alerts.service';

@Injectable({
    providedIn: 'root'
})
export class ImageHandlerServiceFoto {
    constructor(private sanitizer: DomSanitizer, private alertService: AlertsService) { }

    previsualizacion: string = '';
    archivos: any[] = [];

    clearImage(): void {
        this.previsualizacion = '';
        this.archivos = [];
        this.archivos = [];
        const inputElement = document.querySelector('input[type="file"]');
        if (inputElement) {
            (inputElement as HTMLInputElement).value = '';
        }
    }

    capturarFile(event: any,): void {
        const archivoCapturado = event.target.files[0];

        if (archivoCapturado.size > 3000000 && archivoCapturado) {
            this.clearImage();

            this.alertService.mostrarSweetAlert(false, 'El peso del archivo excede los 3Mb, por favor seleccione una imagen de menor tamaño');

            return;
        }

        this.extraerBase64(archivoCapturado).then((imagen: any) => {
            this.previsualizacion = imagen.base;
        });
        // Reemplazar el primer elemento del array archivos
        if (this.archivos.length > 0) {
            this.archivos[0] = archivoCapturado;
        } else {
            this.archivos.push(archivoCapturado);
        }
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
                reject(error);
            };
        } catch (e) {
            console.error('Error al extraer base64:', e);
            reject(e);
        }
    });

    getPrevisualizacion(img: string | any = '') {
        return this.previsualizacion = img ? img : '';
    }
}