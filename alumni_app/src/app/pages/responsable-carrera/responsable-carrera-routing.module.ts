import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EncuestasComponent } from './encuestas/encuestas.component';
import { RespuestasComponent } from './respuestas/respuestas.component';
import { EncuestaDetalleModalComponent } from './encuesta-detalle-modal/encuesta-detalle-modal.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { RespuestasEncuestaCarreraComponent } from './respuestas-encuesta-carrera/respuestas-encuesta-carrera.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'encuestas', component: EncuestasComponent },
  { path: 'detalle', component: EncuestaDetalleModalComponent },
  { path: 'respuestas', component: RespuestasComponent },
  { path: 'respuestas-carrera', component: RespuestasEncuestaCarreraComponent },
  { path: 'seguimiento', component: SeguimientoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsableCarreraRoutingModule { }
