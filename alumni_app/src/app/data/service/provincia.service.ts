import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from '../model/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  urlEndPoint = environment.apiURL + '/provincias';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.urlEndPoint);
  }

  createProvincia(province: Provincia): Observable<Provincia> {
    return this.http.post<Provincia>(this.urlEndPoint, province, { headers: this.httpHeaders })
  }

  getProvinciaById(id: any): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.urlEndPoint}/${id}`)
  }

  updateProvincia(id: number, provincia: Provincia): Observable<Provincia> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Provincia>(url, provincia, { headers: this.httpHeaders });
  }

}
