import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ofertaLaboral } from '../../../data/model/ofertaLaboral';
import { GraduadoDTO } from '../../../data/model/DTO/GraduadoDTO';
import { Subject } from 'rxjs';
import { MailRequest } from '../../../data/model/Mail/MailRequest';
import { PostulacionService } from '../../../data/service/postulacion.service';
import { Postulacion } from '../../../data/model/postulacion';
import { EstadoPostulacion } from '../../../data/model/enum/enums';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesService } from '../../../data/DataTables.service';
import { FiltersService } from '../../../data/Filters.service';
import { AlertsService } from '../../../data/Alerts.service';
@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.css']
})
export class PostulacionesComponent implements OnInit {

  // =====================================================
  //*               DATA TABLE Y FILTROS
  // =======================================================

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};

  estadoPostulacion = EstadoPostulacion;
  mailRequest: MailRequest = new MailRequest();
  postulaciones: ofertaLaboral[] = [];
  misPostulaciones: Postulacion[] = [];
  graduadoDTO: GraduadoDTO = new GraduadoDTO();
  loading: boolean = false;

  @Output() onClose: EventEmitter<string> = new EventEmitter();
  searchTerm: string = '';

  constructor(
    private alertService: AlertsService,
    private mypPostulacionService: PostulacionService,
    public dtService: DataTablesService,
    public filterService: FiltersService
  ) { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    const columnTitles = ['#', 'Empresa', 'Cargo', 'Area conocimientos', 'Salario', 'Apertura', 'Experiencia', 'Ciudad', 'Estado', 'Publicaciones'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar ofertas laborales ...');
    this.filterService.initializeDropdowns('filterTable', columnTitles);
    this.detallarOferta();
  }

  ngAfterViewInit(): void {
    this.filterService.setDtElement(this.dtElement);
  }

  modalImage: string | undefined;
  openModal(imageUrl: string | undefined) {
    this.loading = true;

    this.alertService.mostrarAlertaCargando("Cargando imagen...");

    setTimeout(() => {
      this.loading = false;
      this.modalImage = imageUrl;
      ($('#m_modal_4') as any).modal('show');
      Swal.close();
    }, 2000);
  }

  closeModal() {
    this.modalImage = '';

    if ($('#m_modal_4').hasClass('show')) {
      ($('#m_modal_4') as any).modal('hide');
    }
  }

  async detallarOferta(): Promise<void> {
    const userIdStorage = localStorage.getItem('user_id')

    this.misPostulaciones = (await this.mypPostulacionService.getAllPostulacionesByGraduadoId(userIdStorage ? parseInt(userIdStorage) : 0).toPromise()) || [];

    if (this.initializeTable) {
      this.dtTrigger.next(null);
      this.initializeTable = false;
    } else {
      this.dtService.rerender(this.dtElement, this.dtTrigger);
    }
  }

  cancelOffer(postulacion: Postulacion) {

    const idUser = localStorage.getItem('user_id');

    const miPostulacion = {
      ofertaLaboral: postulacion.ofertaLaboral?.id,
      graduado: parseInt(idUser ? idUser : '0'),
      estado: EstadoPostulacion.CANCELADA_POR_GRADUADO.toString()
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Desea cancelar la postulación?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        this.mypPostulacionService.updateStatePostulacion(postulacion.id ? postulacion.id : 0, miPostulacion).subscribe(() => {

          this.alertService.mostrarAlertaMomentanea("Se ha cancelado la postulación", true);

          this.detallarOferta();
        });
      }
    });
  }

  repostulateOffer(postulacion: Postulacion) {

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Desea postularse a la oferta laboral nuevamente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const idUser = localStorage.getItem('user_id');

        const miPostulacion = {
          ofertaLaboral: postulacion.ofertaLaboral?.id,
          graduado: parseInt(idUser ? idUser : '0'),
          estado: EstadoPostulacion.APLICANDO.toString()
        }

        this.mypPostulacionService.updateStatePostulacion(postulacion.id ? postulacion.id : 0, miPostulacion).subscribe(() => {
          Swal.fire({
            title: "¡Postulado!",
            text: "Se ha postulado a la oferta nuevamente",
            icon: "success"
          });
          this.detallarOferta();
        });
      }
    });
  }
}
