import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Superadmin } from '../model/superadmin';

@Injectable({
  providedIn: 'root'
})
export class SuperAdministradorService {

  urlEndPoint = environment.apiURL + '/superadmin';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getSuperAdmins(): Observable<Superadmin[]> {
    return this.http.get<Superadmin[]>(this.urlEndPoint);
  }

  createSuperAdmin(superadmin: Superadmin): Observable<Superadmin> {
    return this.http.post<Superadmin>(this.urlEndPoint, superadmin, { headers: this.httpHeaders })
  }

  getSuperAdminById(id: any): Observable<Superadmin> {
    return this.http.get<Superadmin>(`${this.urlEndPoint}/${id}`)
  }
}
