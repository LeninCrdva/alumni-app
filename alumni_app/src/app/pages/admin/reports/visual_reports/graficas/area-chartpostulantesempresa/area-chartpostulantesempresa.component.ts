import { Component, HostListener, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke,
  ApexDataLabels, ApexYAxis, ApexTitleSubtitle,
  ApexLegend, ApexFill, ApexPlotOptions
} from 'ng-apexcharts';
import { ApiService } from '../../../../../../data/service/api.service';
import { OfertalaboralService } from '../../../../../../data/service/ofertalaboral.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  fill: ApexFill;
  options: ApexPlotOptions;
};

@Component({
  selector: 'app-area-chartpostulantesempresa',
  templateUrl: './area-chartpostulantesempresa.component.html',
  styleUrl: './area-chartpostulantesempresa.component.css'
})
export class AreaChartpostulantesempresaComponent implements OnInit {
  public chartOptions!: ChartOptions;
  public response: any[] = [];
  public cargos: string[] = [];
  public cantidades: number[] = [];

  constructor(private apiservice: ApiService, private ofertalaboralService: OfertalaboralService) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.ofertalaboralService.obtenerReportePostulacionesActivasPorEmpresa().subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.response = data || {};
          this.cargos = data.map((item: any) => item.nombreEmpresa);
          this.cantidades = data.map((item: any) => item.cantidadPostulacionesActivas);

          if (this.cargos.length > 0 && this.cantidades.length > 0) {
            const dataPoints = this.cargos.map((cargo, index) => ({
              x: cargo,
              y: this.cantidades[index],
            }));

            this.chartOptions = {
              series: [
                {
                  name: 'CANTIDAD DE POSTULACIONES',
                  data: dataPoints,
                },
              ],
              chart: {
                type: 'area',
                width: '100%',
                animations: {
                  enabled: true,
                  easing: 'easeinout',
                  speed: 800,
                  animateGradually: {
                    enabled: true,
                    delay: 150
                  },
                  dynamicAnimation: {
                    enabled: true,
                    speed: 350
                  }
                },
                zoom: {
                  enabled: false,
                },
              },
              options: {
                area: {
                  fillTo: 'end'
                }
              },
              dataLabels: {
                style: {
                  colors: ['#1ed760']
                },
                enabled: true,
              },
              stroke: {
                curve: 'smooth',
                width: 2.25,
              },
              fill: {
                type: 'gradient',
                gradient: {
                  gradientToColors: ['#28b2bc'],
                  inverseColors: true,
                  stops: [20, 80]
                },
              },
              title: {
                text: 'Postulaciones por Empresa',
                align: 'center',
              },
              subtitle: {
                text: '',
                align: 'left',
              },
              xaxis: {
                type: 'category',
              },
              yaxis: {
                opposite: true,
              },
              legend: {
                horizontalAlign: 'left',
              },
              labels: this.cargos,
            };

            this.onResize(); 
          } else {
            console.warn('No hay datos válidos para el gráfico.');
          }
        } else {
          console.warn('La respuesta del servicio no es válida.');
        }
      },
      (error) => {
        console.error('Error al obtener postulaciones por día:', error);
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    if ((event?.target as Window)?.innerHeight !== this.lastBodyHeight) {
      this.lastBodyHeight = (event?.target as Window)?.innerHeight;
      (window as any).dispatchEvent(new Event('resize'));
    }
  }

  private lastBodyHeight = 0;
}