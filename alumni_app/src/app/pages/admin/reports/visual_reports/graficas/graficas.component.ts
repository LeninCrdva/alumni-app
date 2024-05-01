import { Component, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../../data/service/api.service';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit, AfterViewInit {
  datosCargados: boolean = false;

  @ViewChildren('chart') chartComponents!: QueryList<any>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    Swal.fire({
      text: 'Cargando Datos...',
      timer: 2000,
      imageUrl: 'assets/imgs/gifs/estadistica.gif',
      imageHeight: 300,
      showConfirmButton: false,
    });
  }

  ngAfterViewInit(): void {
    forkJoin(
      this.chartComponents.map(component => component.initialize())
    ).subscribe(
      () => {
        this.datosCargados = true;
      },
      (error) => {
        console.error('Error al cargar datos:', error);
        Swal.fire({
          icon: 'error',
          text: 'No existen datos'
        });
        this.datosCargados = false; 
      }
    );
  }
}
