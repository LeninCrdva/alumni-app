import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexResponsive,
  ApexFill,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexLegend,
  ApexYAxis,
  ApexStroke
} from "ng-apexcharts";
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
  responsive:ApexResponsive
};

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {
  public chartOptions!: ChartOptions;

  public response: any = {};
  public fechas: string[] = [];
  public cantidades: number[] = [];

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    this.apiservice.getCargoConOfertas().subscribe(
      (data) => {
        this.response = data || {}; // Manejo de datos nulos
        this.fechas = Object.keys(this.response);
        this.cantidades = Object.values(this.response);

        //console.log('Fechas:', this.fechas);
        //console.log('Cantidades:', this.cantidades);

        if (this.fechas.length > 0 && this.cantidades.length > 0) {
          // Crear un array de objetos { x, y } para cada fecha y cantidad
          const dataPoints = this.fechas.map((fecha, index) => ({
            x: fecha, 
            y: this.cantidades[index],
          }));

          this.chartOptions = {
            series: [
              {
                name: 'Empleos Disponibles ',
                data: dataPoints,
              },
            ],
            options: {
              bar: {
                  horizontal: true,
                  borderRadius: 20,
                  borderRadiusApplication: 'end',
                  borderRadiusWhenStacked: 'last',
                  columnWidth: '70%',
                  barHeight: '40%',
                  distributed: false,
                  rangeBarOverlap: true,
                  rangeBarGroupRows: false,
                  hideZeroBarsWhenGrouped: true,
                  isDumbbell: true,
                  dumbbellColors: undefined,
                  isFunnel: false,
                  isFunnel3d: true,
                  colors: {
                      ranges: [{
                          from: 0,
                          to: 0,
                          color: '#21d18b'
                      }],
                      backgroundBarColors: [],
                      backgroundBarOpacity: 1,
                      backgroundBarRadius: 0,
                  },
                  dataLabels: {
                      position: 'top',
                      maxItems: 100,
                      hideOverflowingLabels: true,
                      orientation: 'horizontal',
                      total: {
                        enabled: false,
                        formatter: undefined,
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                          color: '#373d3f',
                          fontSize: '12px',
                          fontFamily: undefined,
                          fontWeight: 600
                        }
                      }
                  }
              }
          },
          responsive:{
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            },
            chart: {
              type: 'bar',
              width: "100%",
              zoom: {
                enabled: false,
              }, animations: {
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
            }
            },
            dataLabels: {
              style: {
                colors: [ '#1ed760']
              },
              enabled: true,
            },
            stroke: {
              curve: 'smooth',
              width: 0,
            },
            fill: {
              type: "gradient",
              gradient: {                
                gradientToColors: ["#004f9f"],
                inverseColors: true,
                stops: [0, 90]
              }
            },
            title: {
              text: 'Ofertas laborales por Cargo',
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

        } else {
          console.warn('No hay datos válidos para el gráfico.');
        }
      },
      (error) => {
        console.error('Error al obtener postulaciones por día:', error);
      }
    );
  }
  private lastBodyHeight = 0;
}