import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Postulacion } from '../model/postulacion';
import { PostulacionDTO } from '../model/DTO/postulacionDTO';

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {

  urlEndPoint = environment.apiURL + '/postulaciones';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllPostulaciones(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.urlEndPoint}/all`);
  }

  getAllPostulacionesByGraduadoId(id: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.urlEndPoint}/all-postulations-by-graduado/${id}`);
  }

  getAllPostulacionesByOfertaLaboralId(id: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.urlEndPoint}/all-by-oferta-laboral/${id}`);
  }

  getPostulacionById(id: any): Observable<Postulacion> {
    return this.http.get<Postulacion>(`${this.urlEndPoint}/by-id/${id}`)
  }

  countPostulaciones(): Observable<number>{
    return this.http.get<number>(`${this.urlEndPoint}/count`);
  }

  countByDate(date: string): Observable<number>{
    return this.http.get<number>(`${this.urlEndPoint}/count-by-date/${date}`);
  }

  createPostulacion(postulacion: PostulacionDTO): Observable<PostulacionDTO> {
    return this.http.post<PostulacionDTO>(this.urlEndPoint, postulacion, { headers: this.httpHeaders })
  }

  updatePostulacion(id: number, postulacion: Postulacion): Observable<PostulacionDTO> {
    const url = `${this.urlEndPoint}/update/${id}`;
    return this.http.put<PostulacionDTO>(url, postulacion, { headers: this.httpHeaders });
  }

  updateStatePostulacion(id: number, postulacion: PostulacionDTO): Observable<PostulacionDTO> {
    const url = `${this.urlEndPoint}/update-estado/${id}`;
    return this.http.put<PostulacionDTO>(url, postulacion, { headers: this.httpHeaders });
  }

  selectPostulants(id: number, postulants: number[]): Observable<any> {
    const url = `${this.urlEndPoint}/actualizar-estado-por-empresario/${id}`;
    return this.http.put<any>(url, postulants, { headers: this.httpHeaders });
  }

  deletePostulacion(id: number): Observable<Postulacion> {
    return this.http.delete<Postulacion>(`${this.urlEndPoint}/delete/${id}`, { headers: this.httpHeaders });
  }
}
