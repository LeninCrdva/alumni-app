import { Component, HostListener, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke,
  ApexDataLabels, ApexYAxis, ApexTitleSubtitle,
  ApexLegend, ApexFill, ApexPlotOptions
} from 'ng-apexcharts';
import { ApiService } from '../../../../../../data/service/api.service';

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
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit {
  public chartOptions!: ChartOptions;

  public response: any [] = [];
  public fechas: string[] = [];
  public cantidades: number[] = [];

  constructor(private apiservice: ApiService) { }

  ngOnInit(): void {
    this.apiservice.getPostulacionesPorDia().subscribe(
      (data) => {
        this.response = data || {}; // Manejo de datos nulos

        data.forEach((item: { [s: string]: unknown; } | ArrayLike<unknown>) => {
          // Obtener las claves (fechas) y los valores (cantidades) de cada objeto
          const keys = Object.keys(item);
          const values = Object.values(item);

          // Agregar las fechas y cantidades al array fechas y cantidades respectivamente
          this.fechas.push(...keys);
          this.cantidades.push(...values.map(value => Number(value))); // Cast values to numbers
        });

        if (this.fechas.length > 0 && this.cantidades.length > 0) {
          // Crear un array de objetos { x, y } para cada fecha y cantidad
          const dataPoints = this.fechas.map((fecha, index) => ({
            x: fecha,
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
              width: "100%",
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
                fillTo:'end'
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
                gradientToColors: ["#28b2bc"],
                inverseColors: true,
                stops: [20, 80]
              },
            },
            title: {
              text: 'Postulaciones por Día',
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
            labels: this.fechas,
          };

          // Llama al evento "resize", actualizando el chart.
          this.onResize();
        } else {
          console.warn('No hay datos válidos para el gráfico.');
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