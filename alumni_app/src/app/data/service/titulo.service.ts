import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Titulo } from '../model/titulo';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  urlEndPoint = environment.apiURL + '/titulos';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  get(): Observable<Titulo[]> {
    return this.http.get<Titulo[]>(this.urlEndPoint);
  }

  create(titulo: any): Observable<Titulo> {
    return this.http.post<Titulo>(this.urlEndPoint, titulo, { headers: this.httpHeaders });
  }

  getById(id: number): Observable<Titulo> {
    return this.http.get<Titulo>(`${this.urlEndPoint}/${id}`);
  }

  getGraduatedWithTitleAndCareer(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/graduados/carrera`);
  }

  update(id: number, titulo: any): Observable<Titulo> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Titulo>(url, titulo, { headers: this.httpHeaders });
  }

  delete(id: number): Observable<void> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.delete<void>(url, { headers: this.httpHeaders });
  }
}
