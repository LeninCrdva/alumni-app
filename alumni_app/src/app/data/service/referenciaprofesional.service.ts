import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Referencias_profesionales } from '../model/referencia_profesional';

@Injectable({
  providedIn: 'root'
})
export class ReferenciaProfesionalService {

  urlEndPoint = environment.apiURL + '/referencias-profesionales';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  get(): Observable<Referencias_profesionales[]> {
    return this.http.get<Referencias_profesionales[]>(this.urlEndPoint);
  }

  create(referencias_profesionales: any): Observable<Referencias_profesionales> {
    return this.http.post<Referencias_profesionales>(this.urlEndPoint, referencias_profesionales, { headers: this.httpHeaders })
  }

  getById(id: any): Observable<Referencias_profesionales> {
    return this.http.get<Referencias_profesionales>(`${this.urlEndPoint}/${id}`)
  }

  update(id: number, referencias_profesionales: Referencias_profesionales): Observable<Referencias_profesionales> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Referencias_profesionales>(url, referencias_profesionales);
  }

  delete(id: any): Observable<void> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.delete<void>(url, { headers: this.httpHeaders });
  }
}
