import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Rol } from '../model/rol';

@Injectable({
    providedIn: 'root'
})
export class RolService {

    urlEndPoint = environment.apiURL + '/roles';

    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(private http: HttpClient) { }

    getRoles(): Observable<Rol[]> {
        return this.http.get<Rol[]>(this.urlEndPoint);
    }

    createRol(rol: Rol): Observable<Rol> {
        return this.http.post<Rol>(this.urlEndPoint, rol, { headers: this.httpHeaders })
    }

    getRolById(id: any): Observable<Rol> {
        return this.http.get<Rol>(`${this.urlEndPoint}/${id}`)
    }

}