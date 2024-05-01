import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { sectorempresarial } from '../model/sectorEmpresarial';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class SectorEmpresarialService {

    urlEndPoint = environment.apiURL + '/sectoresEmpresariales';

    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(private http: HttpClient) { }

    getSectoresEmpresariales(): Observable<sectorempresarial[]> {
        return this.http.get<sectorempresarial[]>(this.urlEndPoint);
    }

    createSectorEmpresarial(sector: sectorempresarial): Observable<sectorempresarial> {
        return this.http.post<sectorempresarial>(this.urlEndPoint, sector, { headers: this.httpHeaders })
    }

    getSectorEmpresarialById(id: any): Observable<sectorempresarial> {
        return this.http.get<sectorempresarial>(`${this.urlEndPoint}/${id}`)
    }

    updateSectorEmpresarial(id: number, sector: sectorempresarial): Observable<sectorempresarial> {
        const url = `${this.urlEndPoint}/${id}`;
        return this.http.put<sectorempresarial>(url, sector, { headers: this.httpHeaders });
      }

      filtrarSectoresPorNombre(nombre: string): Observable<sectorempresarial | undefined> {
        return this.http.get<sectorempresarial[]>(this.urlEndPoint).pipe(
          map(sectores => sectores.find(sector => sector.nombre.toLowerCase().includes(nombre.toLowerCase())))
        );
      }

}