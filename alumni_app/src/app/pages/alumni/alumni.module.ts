import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumniRoutingModule } from './alumni-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParametrosPreguntasComponent } from './parametros-preguntas/parametros-preguntas.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { CapacitacionesComponent } from './capacitaciones/capacitaciones.component';
import { ExperienciaComponent } from './experiencia/experiencia.component';
import { TitulosComponent } from './titulos/titulos.component';
import { ReferenciasPersonalesComponent } from './referencias-personales/referencias-personales.component';
import { ComunidadComponent } from './comunidad/comunidad.component';
import { ReferenciasLaboralesComponent } from './referencias-laborales/referencias-laborales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuevoGraduadoModalComponent } from './nuevo-graduado-modal/nuevo-graduado-modal.component';
import { OfertasDeTrabajoComponent } from './ofertas-de-trabajo/ofertas-de-trabajo.component';
import { OfertaDetalleComponent } from './oferta-detalle/oferta-detalle.component';
import { PostulacionesComponent } from './postulaciones/postulaciones.component';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import { BarChartComponent } from './reports/visual_reports/graficas/bar-chart/bar-chart.component';
import { GraficasComponent } from './reports/visual_reports/graficas/graficas.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { EncuestasresponseComponent } from './encuestasresponse/encuestasresponse.component';

import { EncuestasaresponderformComponent } from './encuestasaresponderform/encuestasaresponderform.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ParametrosPreguntasComponent,
        PerfilUsuarioComponent,
        PerfilFormComponent,
        CapacitacionesComponent,
        ExperienciaComponent,
        TitulosComponent,
        ReferenciasPersonalesComponent,
        ComunidadComponent,
        ReferenciasLaboralesComponent,
        NuevoGraduadoModalComponent,
        OfertasDeTrabajoComponent,
        OfertaDetalleComponent,
        PostulacionesComponent,
        BarChartComponent,
        GraficasComponent,
        EncuestasresponseComponent,
        EncuestasaresponderformComponent
        
    ],
    imports: [
        CommonModule,
        AlumniRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        NgApexchartsModule,
        NgMultiSelectDropDownModule.forRoot()
    ]
})

export class AlumniModule { }
