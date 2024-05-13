import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad } from '../model/ciudad';
import { CiudadDTO } from '../model/DTO/ciudadDTO';
import { map, filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  urlEndPoint = environment.apiURL + '/ciudades';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getCiudades(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.urlEndPoint);
  }

  getCiudadesDTO(): Observable<CiudadDTO[]> {
    return this.http.get<CiudadDTO[]>(this.urlEndPoint);
  }

  createCiudad(city: Ciudad): Observable<Ciudad> {
    return this.http.post<Ciudad>(this.urlEndPoint, city, { headers: this.httpHeaders })
  }

  createCiudadDTO(city: CiudadDTO): Observable<CiudadDTO> {
    return this.http.post<CiudadDTO>(this.urlEndPoint, city, { headers: this.httpHeaders })
  }

  getCiudadById(id: any): Observable<Ciudad> {
    return this.http.get<Ciudad>(`${this.urlEndPoint}/${id}`)
  }

  updateCity(id: number, city: Ciudad): Observable<Ciudad> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Ciudad>(url, city, { headers: this.httpHeaders });
  }

  updateCityDTO(id: number, city: CiudadDTO): Observable<CiudadDTO> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<CiudadDTO>(url, city, { headers: this.httpHeaders });
  }
  filtrarCiudadPorNombre(nombre: string): Observable<Ciudad> {
    return this.http.get<Ciudad[]>(this.urlEndPoint).pipe(
      map(ciudades => ciudades.filter(ciudad => ciudad.nombre.toLowerCase() === nombre.toLowerCase())),
      filter(ciudadesFiltradas => ciudadesFiltradas.length > 0),
      map(ciudadesFiltradas => ciudadesFiltradas[0])
    );
  }

}
