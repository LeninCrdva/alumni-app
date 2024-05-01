import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Capacitacion } from '../model/capacitacion';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionService {

  urlEndPoint = environment.apiURL + '/capacitacion';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  get(): Observable<Capacitacion[]> {
    return this.http.get<Capacitacion[]>(`${this.urlEndPoint}/list`);
  }

  create(capacitacion: Capacitacion): Observable<Capacitacion> {
    return this.http.post<Capacitacion>(`${this.urlEndPoint}/save-cap`, capacitacion, { headers: this.httpHeaders })
  }

  getById(id: any): Observable<Capacitacion> {
    return this.http.get<Capacitacion>(`${this.urlEndPoint}/find-cap/${id}`)
  }

  update(id: any, Capacitacion: Capacitacion): Observable<Capacitacion> {
    const url = `${this.urlEndPoint}/update-cap/${id}`;
    return this.http.put<Capacitacion>(url, Capacitacion, { headers: this.httpHeaders });
  }

  delete(id: any): Observable<void> {
    const url = `${this.urlEndPoint}/delete-cap/${id}`;
    return this.http.delete<void>(url, { headers: this.httpHeaders });
  }
}