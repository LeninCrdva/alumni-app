import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../../data/service/api.service';
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
  responsive: ApexResponsive
};

@Component({
  selector: 'app-pie-chart2',
  templateUrl: './pie-chart2.component.html',
  styleUrl: './pie-chart2.component.css'
})
export class PieChart2Component implements OnInit {
  public chartOptions!: ChartOptions;
  public response: any = {};
  public fechas: string[] = [];
  public cantidades: number[] = [];
  public carreras: string[] = []; 
  public selectedCarrera: string = ''; 

  constructor(private apiservice: ApiService) { }

  ngOnInit(): void {
    this.apiservice.getCarreras().subscribe(
      (data) => {
        this.carreras = data.map((carrera: any) => carrera.nombre) || [];
        console.log("carreras: ", this.carreras);
      },
      (error) => {
        console.error('Error al obtener el listado de carreras:', error);
      }
    );
    this.loadChart();
  }
    loadChart(): void {
    this.apiservice.getSexCount().subscribe(
      (data) => {
        this.response = data || {}; 
        this.fechas = Object.keys(this.response);
        this.cantidades = Object.values(this.response);

        //console.log('Fechas:', this.fechas);
        //console.log('Cantidades:', this.cantidades);

        if (this.fechas.length > 0 && this.cantidades.length > 0) {
          const dataPoints = this.fechas.map((fecha, index) => ({
            x: fecha,
            y: this.cantidades[index],
          }));

          this.chartOptions = {
            series: [
              {
                name: 'Numero de Graduados',
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
                  orientation: 'vertical',
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
            responsive: {
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
                easing: 'linear',
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
                colors: ['#1ed760']
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
              text: 'Graduados por Tipo de Sexo General',
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
  onCarreraSelect(event: any): void {
    this.selectedCarrera = event.target.value;
    console.log('Carrera seleccionada: ' + this.selectedCarrera);
    this.apiservice.obtenerGraduadosPorSexo(this.selectedCarrera).subscribe(
      (data) => {
        console.log('Datos de graduados por sexo para ' + this.selectedCarrera + ': ', data);
        this.response = data || {}; 
        this.fechas = Object.keys(this.response);
        this.cantidades = Object.values(this.response);

        console.log('Fechas:', this.fechas);
        console.log('Cantidades:', this.cantidades);

        if (this.fechas.length > 0 && this.cantidades.length > 0) {
          const dataPoints = this.fechas.map((fecha, index) => ({
            x: fecha,
            y: this.cantidades[index],
          }));

          this.chartOptions = {
            series: [
              {
                name: 'Numero de Graduados',
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
                  orientation: 'vertical',
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
            responsive: {
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
                easing: 'linear',
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
                colors: ['#1ed760']
              },
              enabled: true,
            },
            stroke: {
              curve: 'straight',
              width: 10,
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
              text: 'Graduados por sexo de ' + this.selectedCarrera,
              align: 'left',
              margin: 10,
              offsetX: 0,
              offsetY: 0,
              floating: false,
              style: {
                fontSize:  '11px',
                fontWeight:  'bold',
                fontFamily:  'Arial',
                color:  '#263238'
              },
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
        console.error('Error al obtener los datos de graduados por sexo para ' + this.selectedCarrera + ': ', error);
      }
    );
  }
}

