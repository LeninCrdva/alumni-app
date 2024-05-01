import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Periodo } from '../model/periodo';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  urlEndPoint = environment.apiURL + '/peridos';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getPeriodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(this.urlEndPoint);
  }

  createPeriodo(periodo: Periodo): Observable<Periodo> {
    return this.http.post<Periodo>(this.urlEndPoint, periodo, { headers: this.httpHeaders })
  }

  getPeriodoById(id: any): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.urlEndPoint}/${id}`)
  }

  updatePeriod(id: number, period: Periodo): Observable<Periodo> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Periodo>(url, period, { headers: this.httpHeaders });
  }

}
