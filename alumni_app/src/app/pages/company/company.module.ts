import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyRoutingModule } from './company-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfertasLaboralesComponent } from './ofertas-laborales/ofertas-laborales.component';
import { CrudEmpresasComponent } from './crud-empresas/crud-empresas.component';
import { Empresas2Component } from './empresas-2/empresas-2.component';
import { DataTablesModule } from 'angular-datatables';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReportsComponent } from './reports/reports.component';
import { PieChartComponent } from './reports/pie-chart/pie-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartComponent } from './reports/bar-chart/bar-chart.component';
@NgModule({
    declarations: [
        DashboardComponent,
        OfertasLaboralesComponent,
        CrudEmpresasComponent,
        Empresas2Component,
        PerfilFormComponent,
        ReportsComponent,
        PieChartComponent,
        BarChartComponent,
       // NuevoEmpresarioModalComponent
    ],
    imports: [
        CommonModule,
        CompanyRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        NgApexchartsModule,
        NgMultiSelectDropDownModule.forRoot()
    ]
})

export class CompanyModule { }
