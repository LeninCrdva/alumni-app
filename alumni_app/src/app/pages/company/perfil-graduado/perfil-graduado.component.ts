import { Component } from '@angular/core';
import { GraduadoService } from '../../../data/service/graduado.service';
import { Graduado } from '../../../data/model/graduado';
import { Usuario } from '../../../data/model/usuario';
import { Ciudad } from '../../../data/model/ciudad';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil-graduado',
  templateUrl: './perfil-graduado.component.html',
  styleUrls: ['./perfil-graduado.component.css', '../../../../assets/prefabs/PerfilUser.css']
})
export class PerfilGraduadoComponent {

  public urlImage: string = '';
  public rutaimagen: string = '';
  public graduadoid: number = 0;
  public idstring: string = '';
  graduado: Graduado = { id: 0, usuario: new Usuario(), ciudad: new Ciudad(), anioGraduacion: new Date(), emailPersonal: '', estadoCivil: '', rutaPdf: '', urlPdf: '' };
  pdfBytes: string  = '';
  pdfUrl: SafeResourceUrl | undefined = '';

  ngOnInit(): void {
    this.loadUserDataByUsername();
    this.idstring = localStorage.getItem('idGraduado') || '';
    this.graduadoid = parseInt(this.idstring, 10)
  }

  ngAfterViewInit() {
    if (this.graduadoid > 0) {
      this.getGraduadoById();
    }
  }

  constructor(private graduadoService: GraduadoService, private sanitizer: DomSanitizer) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  getGraduadoById() {
    this.graduadoService.getGraduadoWithPdfId(this.graduadoid).subscribe(
      (response) => {
        this.graduado = response.data;
        this.pdfBytes = response.pdfBytes;

        if (this.pdfBytes) {
          const byteCharacters = atob(this.pdfBytes);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

          const unsafeUrl = URL.createObjectURL(pdfBlob);

          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        }
      }
    )
  }
  
  loadUserDataByUsername() {
    const storedRutaImagen = localStorage.getItem('ruta_imagen');
    const storedUrlImagen = localStorage.getItem('url_imagen');
    if (storedRutaImagen && storedUrlImagen) {
      this.rutaimagen = storedRutaImagen;
      this.urlImage = storedUrlImagen;
    } else {
      // Manejar el caso en el que la información no esté disponible en localStorage
      console.error('La información de imagen no está disponible en localStorage.');
    }
  }
}
