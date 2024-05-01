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
  responsive:ApexResponsive
};

@Component({
  selector: 'app-pie-chartpostulantesseleccioandos',
  templateUrl: './pie-chartpostulantesseleccioandos.component.html',
  styleUrl: './pie-chartpostulantesseleccioandos.component.css'
})
export class PieChartpostulantesseleccioandosComponent {
  public chartOptions!: ChartOptions;

  public response: any = {};
  public ofertas: string[] = [];
 // public cantidades: number[] = [];
  public cantidadesseleccionados: number[] = [];

  constructor(private apiservice: ApiService, private ofertalaboralService:OfertalaboralService) {}

  ngOnInit(): void {
    this.ofertalaboralService.obtenerReportePostulacionesYAceptados().subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
        this.response = data || {}; // Manejo de datos nulos
        this.ofertas = data.map((item: any) => item.cargo || `Oferta Laboral ${item.ofertaLaboralId}`);
   //     this.cantidades = data.map((item: any) => item.postulantesActivos);
        this.cantidadesseleccionados = data.map((item: any) => item.postulantesAceptados);

       // console.log('Ofertas:', this.ofertas);
       // console.log('Cantidades:', this.cantidades);
        //console.log('Aceptados:', this.cantidadesseleccionados);

        if (this.ofertas.length > 0 && this.cantidadesseleccionados.length > 0) {
          // Crear un array de objetos { x, y } para cada fecha y cantidad
          const dataPoints = this.ofertas.map((oferta, index) => ({
            x: oferta, 
            y: this.cantidadesseleccionados[index],
          }));

          this.chartOptions = {
            series: [
              {
                name: 'Graduados Seleccionados ',
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
              text: 'Postulantes por Cargo Seleccionados',
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
            labels: this.ofertas,
          };

        } else {
          console.warn('No hay datos válidos para el gráfico.');
        }
      }else {
        console.warn('La respuesta del servicio no es válida.');
      }
      },
      (error) => {
        console.error('Error al obtener postulaciones por día:', error);
      }
    );
  }
  private lastBodyHeight = 0;

}
