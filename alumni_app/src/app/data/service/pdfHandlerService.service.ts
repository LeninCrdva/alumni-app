import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertsService } from '../Alerts.service';

@Injectable({
    providedIn: 'root'
})
export class PdfHandlerService {
    constructor(
        private sanitizer: DomSanitizer,
        private alertService: AlertsService
    ) {
        this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    }

    pdfUrl: any = null;
    pdfFile: any[] = [];

    clearPdf(): void {
        this.pdfUrl = null;
        const inputElement = document.getElementById('pdfFile');
        if (inputElement) {
            (inputElement as HTMLInputElement).value = '';
        }
    }

    handlePdfFile(event: any): void {
        const pdfFile = event.target.files[0];

        if (pdfFile.size > 5000000 && pdfFile) {
            this.clearPdf();

            this.alertService.mostrarSweetAlert(false, 'El peso del archivo excede los 5Mb, por favor seleccione un archivo de menor tamaño');

            return;
        }

        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfFile));

        // Reemplazar el primer elemento del array pdfFile
        if (this.pdfFile.length > 0) {
            this.pdfFile[0] = pdfFile;
        } else {
            this.pdfFile.push(pdfFile);
        }
    }
}