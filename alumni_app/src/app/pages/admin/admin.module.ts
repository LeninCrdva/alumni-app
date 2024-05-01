import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectorEmpComponent } from './sector-emp/sector-emp.component';
import { NuevoAdministradorModalComponent } from './nuevo-administrador-modal/nuevo-administrador-modal.component';
import { UsuariosListsComponent } from './usuarios-lists/usuarios-lists.component';
import { DocumentosComponent } from './reports/docs_reports/documentos/documentos.component';
import { EmpresaReportComponent } from './reports/empresa-report/empresa-report.component';
import { AreaChartComponent } from './reports/visual_reports/graficas/area-chart/area-chart.component';
import { PieChartComponent } from './reports/visual_reports/graficas/pie-chart/pie-chart.component';
import { GraficasComponent } from './reports/visual_reports/graficas/graficas.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import { ProvinciaComponent } from './provincia/provincia.component';
import { PeriodoCarreraComponent } from './periodo-carrera/periodo-carrera.component';
import { CarreraComponent } from './carrera/carrera.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BarChartComponent } from './reports/visual_reports/graficas/bar-chart/bar-chart.component';
import { EncuestasComponent } from './encuestas/encuestas.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PieChart2Component } from './reports/visual_reports/graficas/pie-chart2/pie-chart2.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { OfertasLaboralesComponent } from './ofertas-laborales/ofertas-laborales.component';
import { DataTablesModule } from 'angular-datatables';
import { SurveyDetailsModalComponent } from './survey-details-modal/survey-details-modal.component';
import { RequestencuestaComponent } from './requestencuesta/requestencuesta.component';
import { EncuestascardComponent } from './encuestascard/encuestascard.component';
import { WebBuilderComponent } from './web-builder/web-builder.component';
import { CreateDataWebComponent } from './web-builder/create-data/create-data-web.component';
import { GestionProgramasComponent } from './gestion-programas/gestion-programas.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { PieChartpostulantesactivosComponent } from './reports/visual_reports/graficas/pie-chartpostulantesactivos/pie-chartpostulantesactivos.component';
import { PieChartpostulantesseleccioandosComponent } from './reports/visual_reports/graficas/pie-chartpostulantesseleccioandos/pie-chartpostulantesseleccioandos.component';
import { AreaChartpostulantescarreraComponent } from './reports/visual_reports/graficas/area-chartpostulantescarrera/area-chartpostulantescarrera.component';
import { AreaChartpostulantesempresaComponent } from './reports/visual_reports/graficas/area-chartpostulantesempresa/area-chartpostulantesempresa.component';
import { RespuestasEncuestaCarreraComponent } from './respuestas-encuesta-carrera/respuestas-encuesta-carrera.component';
import { GraduadosTituloCarreraComponent } from './reports/graduados-titulo-carrera/graduados-titulo-carrera.component';
@NgModule({
  declarations: [
    DashboardComponent,
    SectorEmpComponent,
    NuevoAdministradorModalComponent,
    UsuariosListsComponent,
    EmpresaReportComponent,
    AreaChartComponent,
    PieChartComponent,
    DocumentosComponent,
    GraficasComponent,
    ProvinciaComponent,
    PeriodoCarreraComponent,
    CarreraComponent,
    BarChartComponent,
    PerfilFormComponent,
    EncuestasComponent,
    PieChart2Component,
    EmpresasComponent,
    OfertasLaboralesComponent,
    EncuestascardComponent,
    SurveyDetailsModalComponent,
    RequestencuestaComponent,
    WebBuilderComponent,
    CreateDataWebComponent,
    GestionProgramasComponent,
    TextEditorComponent,
    SeguimientoComponent,
    PieChartpostulantesactivosComponent,
    PieChartpostulantesseleccioandosComponent,
    AreaChartpostulantescarreraComponent,
    AreaChartpostulantesempresaComponent,
    RespuestasEncuestaCarreraComponent,
    GraduadosTituloCarreraComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgApexchartsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})

export class AdminModule { }
