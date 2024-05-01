import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataValidationService {

  urlEndPoint = environment.apiURL;

  constructor(private http: HttpClient) { }

  validateGraduateEmail(email: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/graduados/exists/email/${email}`;
    return this.http.get<boolean>(url);
  }

  validateBusinessEmail(email: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/empresarios/exists/email/${email}`;
    return this.http.get<boolean>(url);
  }

  validateAdminEmail(email: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/administradores/exists/email/${email}`;
    return this.http.get<boolean>(url);
  }

  validateCompanyRuc(ruc: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/empresas/exists/ruc/${ruc}`;
    return this.http.get<boolean>(url);
  }

  validateCompnanyName(name: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/empresas/exists/nombre/${name}`;
    return this.http.get<boolean>(url);
  }

  validateUsername(username: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/usuarios/exists/username/${username}`;
    return this.http.get<boolean>(url);
  }

  validatePhone(phone: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/personas/exists/telefono/${phone}`;
    return this.http.get<boolean>(url);
  }

  validateIdentityCard(identityCard: string): Observable<boolean> {
    const url = `${this.urlEndPoint}/personas/exists/cedula/${identityCard}`;
    return this.http.get<boolean>(url);
  }
}
