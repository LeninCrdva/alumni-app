import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Experiencia } from '../model/experiencia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {

  urlEndPoint = environment.apiURL + '/experiencias';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  get(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(this.urlEndPoint);
  }

  create(experience: any): Observable<Experiencia> {
    return this.http.post<Experiencia>(`${this.urlEndPoint}/create`, experience, { headers: this.httpHeaders });
  }

  getById(id: any): Observable<Experiencia> {
    return this.http.get<Experiencia>(`${this.urlEndPoint}/${id}`);
  }

  update(id: any, experiencia: Experiencia): Observable<Experiencia> {
    return this.http.put<Experiencia>(`${this.urlEndPoint}/update/${id}`, experiencia, { headers: this.httpHeaders });
  }

  delete(id: any): Observable<void> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.delete<void>(url, { headers: this.httpHeaders });
  }
}
