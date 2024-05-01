import { Component, OnInit } from '@angular/core';
import { OfertalaboralService } from '../../../data/service/ofertalaboral.service';
import { GraduadoDTO } from '../../../data/model/DTO/GraduadoDTO';
import Swal from 'sweetalert2';
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
  

  requestOffer(idOFerta: number): void {
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
}
