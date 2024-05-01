import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logro } from '../model/logro';

@Injectable({
  providedIn: 'root'
})
export class LogroService {

  urlEndPoint = environment.apiURL + '/logros';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getLogros(): Observable<Logro[]> {
    return this.http.get<Logro[]>(this.urlEndPoint);
  }

  createLogro(logro: Logro): Observable<Logro> {
    return this.http.post<Logro>(this.urlEndPoint, logro, { headers: this.httpHeaders })
  }

  getLogroById(id: any): Observable<Logro> {
    return this.http.get<Logro>(`${this.urlEndPoint}/${id}`)
  }
}
