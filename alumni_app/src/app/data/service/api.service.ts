import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class ApiService {
    baseUrl = environment.apiURL;
  
    constructor(private http: HttpClient) { }
  
    getPostulacionesPorDia(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/ofertas-laborales/postulaciones-por-dia`);
    }
    getGraduadosConExperiencia(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/experiencias/graduados-con-experiencia`);
    }
    getCargoConOfertas(): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/ofertas-laborales/cargos-con-ofertas`);
    }
    getSexCount(): Observable<any>{
      return this.http.get<any>(`${this.baseUrl}/graduados/count-sex`)
    }
    getCarreras(): Observable<any>{
      return this.http.get<any>(`${this.baseUrl}/carreras`)
    }
    obtenerGraduadosPorSexo(nombreCarrera: string): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/titulos/graduados-por-sexo?nombreCarrera=${nombreCarrera}`);
    }
  }
