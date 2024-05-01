import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ofertaLaboral } from '../model/ofertaLaboral';
import { ofertaLaboralDTO } from '../model/DTO/ofertaLaboralDTO';
import { Observable } from 'rxjs';
import { Graduado } from '../model/graduado';
import { contratacion } from '../model/contratacion';

@Injectable({
  providedIn: 'root'
})
export class OfertalaboralService {

  urlEndPoint = environment.apiURL + '/ofertas-laborales';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getGraduadosByOfertaLaboral(id: number): Observable<Graduado[]>{
    return this.http.get<Graduado[]>(`${this.urlEndPoint}/graduados/${id}`)
  }
  getGraduadosWithActivePostulationByOfertaLaboral(id: number): Observable<Graduado[]>{
    return this.http.get<Graduado[]>(`${this.urlEndPoint}/graduados-postulantes-activos/${id}`)
  }
  getGraduadosWithCancelPostulationByOfertaLaboral(id: number): Observable<Graduado[]>{
    return this.http.get<Graduado[]>(`${this.urlEndPoint}/graduados-postulantes-inactivos/${id}`)
  }
  getGraduadosSeleccionadosByOfertaLaboral(id: number): Observable<Graduado[]>{
    return this.http.get<Graduado[]>(`${this.urlEndPoint}/graduados-postulantes-seleccionados/${id}`)
  }
  getGraduadosContradatosByOfertaLaboral(id: number): Observable<contratacion[]>{

    return this.http.get<contratacion[]>(`${this.urlEndPoint}/ofertaLaboral/${id}`)
  }
  deleteGraduadoContratado(id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/contrataciones/${id}`);
  }

  OfertasLaborales(name:string): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/empresario/${name}`);
  }
  getOfertasLaborales(): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}`);
  }
  getOfertasLaboralesByEmpresario(name: string): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/usuario/${name}`);
  }

  getOfertaLaboral(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/with-pdf/${id}`);
  }
  
  getOfertasLaboralesByNameEmpresario(name: string): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/empresario/${name}`);
  }

  createOfertaLaboral(oferta: ofertaLaboralDTO): Observable<ofertaLaboral> {
    return this.http.post<ofertaLaboral>(this.urlEndPoint, oferta, { headers: this.httpHeaders })
  }

  getOfertaLaboralById(id: number): Observable<ofertaLaboral> {
    return this.http.get<ofertaLaboral>(`${this.urlEndPoint}/${id}`)
  }

  getOfertaLaboralWithPostulateByGraduateId(id:number): Observable<ofertaLaboralDTO[]> {
    return this.http.get<ofertaLaboralDTO[]>(`${this.urlEndPoint}/ofertas-sin-postular/${id}`);
  }

  getOfertaLaboralByIdToDTO(id: number): Observable<ofertaLaboralDTO> {
    return this.http.get<ofertaLaboralDTO>(`${this.urlEndPoint}/dto/${id}`)
  }

  updateOfertaLaboral(id: number, ofertaLaboralDTO: ofertaLaboralDTO): Observable<any> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put(url, ofertaLaboralDTO);
  }

  selectContratados(id: number,data: Array<any>): Observable<any> {
    const url = `${this.urlEndPoint}/seleccionar-contratados/${id}`;

    return this.http.post(url, data);
  }

  cancelarOReactivarOfertaLaboral(id: number, estado: string): Observable<any> {
    const url = `${this.urlEndPoint}/cancelar-oferta/${id}?estado=${estado}`;

    return this.http.put(url, id);
  }

  deleteOfertabyID  (id: number): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`);
  }
  //Reportes
  
  obtenerReportePostulacionesYAceptados(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/reporte-postulaciones-aceptados`);
  }

  obtenerReportePostulacionesActivasPorEmpresa(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/reporte-postulaciones-activas-por-empresa`);
  }

  generarReportePostulantesPorCarrera(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/reporte-postulantes-activos-y-seleccionados-por-carrera`);
  }
}
