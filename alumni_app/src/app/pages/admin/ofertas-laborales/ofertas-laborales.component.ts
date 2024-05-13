import { Component, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { OfertalaboralService } from '../../../data/service/ofertalaboral.service';
import { DataTableDirective } from 'angular-datatables';
import { FiltersService } from '../../../data/Filters.service';
import { DataTablesService } from '../../../data/DataTables.service';
import { AlertsService } from '../../../data/Alerts.service';
import { ofertaLaboral } from '../../../data/model/ofertaLaboral';
import { ofertaLaboralDTO } from '../../../data/model/DTO/ofertaLaboralDTO';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ofertas-laborales',
  templateUrl: './ofertas-laborales.component.html',
  styleUrl: './ofertas-laborales.component.css'
})
export class OfertasLaboralesComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  initializeTable: boolean = true;
  dtoptions: DataTables.Settings = {};
  stateForm: FormGroup;
  ofertasLaboralesList: ofertaLaboralDTO[] = [];
  ofertaLaboralDTO: ofertaLaboralDTO = new ofertaLaboralDTO();
  estadoSeleccionado: string = '';

  idEdit: number = 0;

  editarClicked = false;

  constructor(
    private ofertaService: OfertalaboralService,
    private alertService: AlertsService,
    public dtService: DataTablesService,
    public filterService: FiltersService,
    formBuilder: FormBuilder,
  ) {

    this.stateForm = formBuilder.group({
      state: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadData();
    const columnTitles = ['#', 'Área de conocimiento', 'Cargo', 'Experiencia', 'Salario', 'Fecha de cierre', 'Fecha de publicación', 'Estado', 'Nombre de la empresa','Sitio Web'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar ofertas...');
    this.filterService.initializeDropdowns('filterTable', columnTitles,);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  loadData() {
    this.ofertaService.getOfertasLaborales().subscribe(
      (result) => {
        this.ofertasLaboralesList = [];
        this.ofertasLaboralesList = result;
        if (this.initializeTable) {
          this.dtTrigger.next(null);
          this.initializeTable = false;
        } else {
          this.dtService.rerender(this.dtElement, this.dtTrigger);
        }
      },
      (error: any) => console.error(error)
    );
  }

  updateStateOfertaLaboral(id: any) {
    this.ofertaService.getOfertaLaboralById(id).subscribe(() => {
      let estado = this.stateForm.get('state')?.value;
      if (estado) {
        this.showAlertOption(id, estado);
      }
    });
  }

  showAlertOption(id: any, state: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cambiar el estado de la oferta laboral al estado: ' + state + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ofertaService.cancelarOReactivarOfertaLaboral(id, state).subscribe(() => {
          this.loadData();
        });
      }
    });
  }

  viewOfertaLaboral(id: any) {
    this.ofertaService.getOfertaLaboralByIdToDTO(id).subscribe((result) => {
      this.ofertaLaboralDTO = result;
      this.patchStateForm(this.ofertaLaboralDTO.estado);
    });
  }

  patchStateForm(estado: string) {
    const estadosPermitidos = ['EN_EVALUACION', 'EN_CONVOCATORIA', 'RECHAZADA_POR_ADMINISTRADOR'];
    this.estadoSeleccionado = estadosPermitidos.includes(estado) ? estado : 'OTHER_STATE';
  
    this.stateForm.patchValue({
      state: this.estadoSeleccionado
    });
  }

  fileContent: string | ArrayBuffer | null = null;

  async importarDatos(): Promise<void> {
    if (!this.fileContent || typeof this.fileContent !== 'string') {
      this.alertService.mostrarSweetAlert(false, 'No hay archivo o formato inválido.');
      return;
    }

    try {
      this.alertService.mostrarAlertaCargando('Importando datos...');
      const data = JSON.parse(this.fileContent);

      if (Array.isArray(data)) {
        for (const dataToRestore of data) {
          await this.ofertaService.createOfertaLaboral(dataToRestore).toPromise();
        }
        this.alertService.mostrarSweetAlert(true, 'Todo el contenido fue restaurado con éxito.');
      } else {
        this.alertService.mostrarSweetAlert(false, 'El JSON proporcionado no es un array.');
      }
    } catch (error: any) {
      this.alertService.mostrarSweetAlert(false, 'Error al parsear JSON: ' + error.message);
    } finally {
      this.alertService.detenerAlertaCargando();
    }

    this.loadData();
  }

}
