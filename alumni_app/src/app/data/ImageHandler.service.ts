import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ImageHandlerService {
    constructor(private sanitizer: DomSanitizer) { }

    previsualizacion: string = '';
    archivos: any[] = [];

    clearImage(): void {
        this.previsualizacion = '';
        this.archivos = [];
    }

    capturarFile(event: any, ): void {
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
                reject(error);
            };
        } catch (e) {
            console.error('Error al extraer base64:', e);
            reject(e);
        }
    });
}