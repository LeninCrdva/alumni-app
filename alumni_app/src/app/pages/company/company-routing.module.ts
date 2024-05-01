import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfertasLaboralesComponent } from './ofertas-laborales/ofertas-laborales.component';
import { CrudEmpresasComponent } from './crud-empresas/crud-empresas.component';
import { Empresas2Component } from './empresas-2/empresas-2.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PerfilGraduadoComponent } from './perfil-graduado/perfil-graduado.component';
import { ReportsComponent } from './reports/reports.component';
const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'postulaciones_form', component: OfertasLaboralesComponent },
    { path: 'empresas', component: CrudEmpresasComponent },
    { path: 'crud', component: Empresas2Component },
    { path: 'perfil', component: PerfilUsuarioComponent },
    { path: 'update-perfil', component: PerfilFormComponent },
    { path: 'graduado-perfil', component: PerfilGraduadoComponent },
    { path: 'reports', component: ReportsComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, CommonModule],
    exports: [RouterModule]
})

export class CompanyRoutingModule { }