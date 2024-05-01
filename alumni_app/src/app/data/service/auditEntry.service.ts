import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditEntryDTO } from '../model/DTO/AuditEntryDTO';

@Injectable({
  providedIn: 'root'
})
export class AuditEntryService {

  urlEndPoint = environment.apiURL + '/audit-entry';

  constructor(private http: HttpClient) { }

  getAuditList(): Observable<AuditEntryDTO[]> {
    return this.http.get<AuditEntryDTO[]>(`${this.urlEndPoint}`);
  }

  createAuditory(audit: AuditEntryDTO): Observable<AuditEntryDTO> {
    return this.http.post<AuditEntryDTO>(`${this.urlEndPoint}`, audit);
  }

  getAuditById(id: any): Observable<AuditEntryDTO> {
    return this.http.get<AuditEntryDTO>(`${this.urlEndPoint}/${id}`)
  }
}