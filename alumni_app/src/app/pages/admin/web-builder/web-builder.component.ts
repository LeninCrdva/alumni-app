import { Component, ElementRef, Output, Renderer2, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { AlertsServicexml } from "../../../data/service/AlertsServicexml";
import { Router } from "@angular/router";
import { XmlserviceService } from "../../../data/service/xmlservice.service";
import { componentxml } from "../../../data/model/componentxml";
import { FiltersServicexml } from "../../../data/Filters.servicexml";
import { DataTablesService } from "../../../data/DataTables.service";

@Component({
  selector: 'app-web-builder',
  templateUrl: './web-builder.component.html',
  styleUrls: ['./web-builder.component.css']
})
export class WebBuilderComponent {
  editarClicked = false;

  contenidoXML: componentxml[] = [];

  initializeTable: boolean = true;

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild('codeModal') codeModal!: any;

  constructor(
    private webBuilderService: XmlserviceService,
    private alertService: AlertsServicexml,
    private router: Router,
    public filterService: FiltersServicexml,
    public dtService: DataTablesService
  ) { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    const columnTitles = ['#', 'Nombre Del Evento'];
    this.dtoptions = this.dtService.setupDtOptions(columnTitles, 'Buscar pagina...');
    this.filterService.initializeDropdowns(columnTitles, this.dtElement);

    this.loadData();
  }

  loadData() {
    this.webBuilderService.get().subscribe(
      result => {
        this.contenidoXML = [];
        this.contenidoXML = result;
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

  // NOTE: CRUD EVENTS
  onRegistrarClick(): void {
    this.editarClicked = false;

    this.router.navigate(['system/admin/gestion-web-builder/crud/new']);
  }

  onEditarClick(id: number | undefined = 0): void {
    this.editarClicked = true;

    this.router.navigate(['system/admin/gestion-web-builder/crud', id]);
  }

  onDeleteClick(id: number | undefined = 0) {
    this.alertService.mostrarAlertaCargando('Eliminando...');
    this.webBuilderService.delete(id).subscribe(
      () => {
        this.alertService.mostrarSweetAlert(true, 'Eliminado exitosamente.');
        this.loadData();
      },
      error => {
        this.alertService.mostrarSweetAlert(false, 'Error al eliminar.');
      }
    );
  }

  visualizarPagina(id: number | undefined = 0) {
    const url = `/#/inicio/component/${id}`;
    window.open(url, '_blank');
  }
}