import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SectorEmpComponent } from './sector-emp/sector-emp.component';
import { GraficasComponent } from './reports/visual_reports/graficas/graficas.component';
import { UsuariosListsComponent } from '../admin/usuarios-lists/usuarios-lists.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';
import { DocumentosComponent } from './reports/docs_reports/documentos/documentos.component';
import { EmpresaReportComponent } from './reports/empresa-report/empresa-report.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { Ciudad } from '../../data/model/ciudad';
import { PeriodoCarreraComponent } from './periodo-carrera/periodo-carrera.component';
import { CarreraComponent } from './carrera/carrera.component';
import { EncuestasComponent } from './encuestas/encuestas.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { OfertasLaboralesComponent } from './ofertas-laborales/ofertas-laborales.component';
import { SurveyDetailsModalComponent } from './survey-details-modal/survey-details-modal.component';
import { RequestencuestaComponent } from './requestencuesta/requestencuesta.component';
import { EncuestascardComponent } from './encuestascard/encuestascard.component';
import { WebBuilderComponent } from './web-builder/web-builder.component';
import { CreateDataWebComponent } from './web-builder/create-data/create-data-web.component';
import { GestionProgramasComponent } from './gestion-programas/gestion-programas.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { RespuestasEncuestaCarreraComponent } from './respuestas-encuesta-carrera/respuestas-encuesta-carrera.component';
import { GraduadosTituloCarreraComponent } from './reports/graduados-titulo-carrera/graduados-titulo-carrera.component';
const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'perfil-admin', component: PerfilUsuarioComponent },
    { path: 'sector-empresarial', component: SectorEmpComponent },
    { path: 'reportes', component: GraficasComponent },
    { path: 'sector-empresarial', component: SectorEmpComponent },
    { path: 'reportes', component: GraficasComponent },
    { path: 'provincia', component: ProvinciaComponent },
    { path: 'carrera', component: CarreraComponent },
    { path: 'ciudad', component: Ciudad },
    { path: 'periodo', component: PeriodoCarreraComponent },
    { path: 'usuarios-list', component: UsuariosListsComponent },
    { path: 'usuarios-form', component: UsuariosFormComponent },
    { path: 'documentos', component: DocumentosComponent },
    { path: 'graduado-carrera-document', component: GraduadosTituloCarreraComponent },
    { path: 'empresa-document', component: EmpresaReportComponent },
    { path: 'update-perfil', component: PerfilFormComponent },
    { path: 'encuestas', component: EncuestasComponent },
    { path: 'empresas', component: EmpresasComponent },
    { path: 'ofertas-laborales', component: OfertasLaboralesComponent },
    { path: 'encuestascard', component: EncuestascardComponent },
    { path: 'respuestas', component: RequestencuestaComponent },
    { path: 'respuestas-carrera', component: RespuestasEncuestaCarreraComponent },
    { path: 'seguimiento', component: SeguimientoComponent },
    { path: 'gestion-programas', component: GestionProgramasComponent },
    { path: 'gestion-web-builder', component: WebBuilderComponent },
    { path: 'gestion-web-builder/crud/:id', component: CreateDataWebComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }