import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MailRequest } from '../model/Mail/MailRequest';
import { Observable } from 'rxjs';
import { MailResponse } from '../model/Mail/MailResponse';

@Injectable({
    providedIn: 'root'
})
export class MailService {

    urlEndPoint = environment.apiURL + '/mail';

    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

    constructor(private http: HttpClient) { }

    sendCasePostulateEmail(mailRequest: MailRequest): Observable<MailResponse> {
        const url = `${this.urlEndPoint}/sendingEmail`;
        return this.http.post<MailResponse>(url, mailRequest, { headers: this.httpHeaders })
    }

    sendResetPassword(mailRequest: MailRequest): Observable<MailResponse> {
        const url = `${this.urlEndPoint}/recovery-password`;
        return this.http.post<MailResponse>(url, mailRequest, { headers: this.httpHeaders })
    }
    contactUs(mailRequest: MailRequest): Observable<MailResponse> {
        return this.http.post<MailResponse>(`${this.urlEndPoint}/contact-us`, mailRequest, { headers: this.httpHeaders });
    }
}