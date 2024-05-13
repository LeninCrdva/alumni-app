import { Component, OnInit } from '@angular/core';
import { OfertalaboralService } from '../../../data/service/ofertalaboral.service';
import { GraduadoDTO } from '../../../data/model/DTO/GraduadoDTO';
import { MailRequest } from '../../../data/model/Mail/MailRequest';
import { PostulacionService } from '../../../data/service/postulacion.service';
import { PostulacionDTO } from '../../../data/model/DTO/postulacionDTO';
import { EstadoPostulacion } from '../../../data/model/enum/enums';
import { Router } from '@angular/router';
import { ofertaLaboralDTO } from '../../../data/model/DTO/ofertaLaboralDTO';
import { AlertsService } from '../../../data/Alerts.service';

@Component({
  selector: 'app-ofertas-de-trabajo',
  templateUrl: './ofertas-de-trabajo.component.html',
  styleUrls: ['./ofertas-de-trabajo.component.css', '../../../../assets/prefabs/PerfilUser.css']
})
export class OfertasDeTrabajoComponent implements OnInit {
  mailRequest: MailRequest = new MailRequest();
  listOfertas: ofertaLaboralDTO[] = [];
  graduadoDTO: GraduadoDTO = new GraduadoDTO()
  value: string = 'seleccionar'
  userId = localStorage.getItem('user_id');

  constructor(private ofertasService: OfertalaboralService, private alertService: AlertsService, private postulacionService: PostulacionService, private router: Router) { }

  ngOnInit(): void {
    this.cargarOfertas(this.userId ? parseInt(this.userId) : 0);
  }

  cargarOfertas(id: number): void {
    this.ofertasService.getOfertaLaboralWithPostulateByGraduateId(id).subscribe(
      oferta => {
        this.listOfertas = oferta;
      }
    );
  }
  

  requestOffer(idOFerta: number,sitioweb:string): void {
    let isPres: boolean = true;

    const idUser = localStorage.getItem('user_id');

    const postulacionCreate: PostulacionDTO = {
      ofertaLaboral: idOFerta,
      graduado: idUser ? parseInt(idUser) : 0,
      estado: EstadoPostulacion.APLICANDO.toString()
    }

    this.postulacionService.createPostulacion(postulacionCreate).subscribe(
      post => {
        if (post) {

          this.alertService.mostrarAlertaMomentanea('Postulación realizada con éxito');
          this.alertService.mostrarSweetAlertConfirmacion(`Se abrirá la siguiente página: ${sitioweb}`)
          .then(() => {
          
            const newTab = window.open(sitioweb, '_blank');
            
            setTimeout(() => {
              this.router.navigate(['system/alumni/postulaciones']);
            }, 1000); 
          });

          this.cargarOfertas(this.userId ? parseInt(this.userId) : 0);
        }
      }, error => {
        const errorMessages: { [key: string]: string } = {
          'No se puede postular sin tener al menos un título registrado.': 'No se puede postular sin tener al menos un título registrado.',
          'No se puede postular sin tener al menos una referencia personal registrada.': 'No se puede postular sin tener al menos una referencia personal registrada.',
          'No se puede postular sin tener al menos una referencia profesional registrada.': 'No se puede postular sin tener al menos una referencia profesional registrada.',
          'No se puede postular a una oferta laboral ya finalizada.': 'No se puede postular a una oferta laboral ya finalizada.'
        };


        const errorMessage = errorMessages[error.error.message];
        
        if (errorMessage) {
          this.alertService.mostrarSweetAlert(false, errorMessage);
        }
      }
    );
  }

  sortBy(event: any): void {
    const value = event.target.value;

    if (value) {
      this.listOfertas.sort((a, b) => {
        const propA = a[value];
        const propB = b[value];

        if (typeof propA === 'number' && typeof propB === 'number') {
          return propB - propA;
        } else if (typeof propA === 'string' && typeof propB === 'string') {
          return propA.localeCompare(propB);
        } else {
          return 0;
        }
      });
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  obtenerTiempoFaltante(oferta: ofertaLaboralDTO): string {
    const hoy: Date = new Date();
    const fechaPublicacion: Date = new Date(oferta.fechaCierre);

    const diferenciaMilisegundos: number = fechaPublicacion.getTime() - hoy.getTime();
    const diferenciaDias: number = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) {
      return 'Cierra hoy';
    } else if (diferenciaDias === 1) {
      return 'Cierra hace 1 día';
    } else if (diferenciaDias < 7) {
      return `Cierra en ${diferenciaDias} días`;
    } else if (diferenciaDias === 7) {
      return 'Cierra en 1 semana';
    } else {
      const diferenciaSemanas: number = Math.floor(diferenciaDias / 7);
      return `Cierra en ${diferenciaSemanas} semanas`;
    }
  }
}
