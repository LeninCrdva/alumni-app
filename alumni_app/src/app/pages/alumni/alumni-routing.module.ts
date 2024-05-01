import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostulacionesComponent } from './postulaciones/postulaciones.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParametrosPreguntasComponent } from './parametros-preguntas/parametros-preguntas.component';
import { OfertaDetalleComponent } from './oferta-detalle/oferta-detalle.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { OfertasDeTrabajoComponent } from './ofertas-de-trabajo/ofertas-de-trabajo.component';
import { TitulosComponent } from './titulos/titulos.component';
import { ReferenciasPersonalesComponent } from './referencias-personales/referencias-personales.component';
import { ComunidadComponent } from './comunidad/comunidad.component';
import { ExperienciaComponent } from './experiencia/experiencia.component';
import { CapacitacionesComponent } from './capacitaciones/capacitaciones.component';
import { ReferenciasLaboralesComponent } from './referencias-laborales/referencias-laborales.component';
import { NuevoGraduadoModalComponent } from './nuevo-graduado-modal/nuevo-graduado-modal.component';
import { EncuestasresponseComponent } from './encuestasresponse/encuestasresponse.component';
const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    // NOTE: PERFIL
    { path: 'perfil', component: PerfilUsuarioComponent },
    { path: 'update-perfil', component: PerfilFormComponent },
    { path: 'experiencia', component: ExperienciaComponent },
    { path: 'capacitaciones', component: CapacitacionesComponent },
    { path: 'titulos', component: TitulosComponent },
    { path: 'referencias-personales', component: ReferenciasPersonalesComponent },
    { path: 'referencias-laborales', component: ReferenciasLaboralesComponent },
    
    // NOTE: OFERTAS
    { path: 'oferta-detalle/:id', component: OfertaDetalleComponent },
    { path: 'postulaciones', component: PostulacionesComponent },
    { path: 'parametros-preguntas', component: ParametrosPreguntasComponent },
    { path: 'oferta-detalle', component: OfertaDetalleComponent },
    { path: 'ofertas-trabajo', component: OfertasDeTrabajoComponent },
    // NOTE: COMUNIDAD
    { path: 'comunidad', component: ComunidadComponent },
    { path: 'nuevoxd', component: NuevoGraduadoModalComponent },
     // NOTE: Encuestas
     { path: 'encuestas', component: EncuestasresponseComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AlumniRoutingModule { }