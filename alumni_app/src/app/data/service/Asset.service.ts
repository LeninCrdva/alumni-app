// asset.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
const FILES_API = environment.apiURL+'/assets/';

@Injectable({
  providedIn: 'root'
})

export class AssetService {


  constructor(private httpClient: HttpClient) { }

  upload(multipartFile: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();
    formData.append('multipartFile', multipartFile);
    const req = new HttpRequest('POST', `${FILES_API}upload/`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

  getFile(filename: string) {
    return this.httpClient.get(`${FILES_API}get-object/${filename} `);
  }

  delete(filename: string) {
    return this.httpClient.get(`${FILES_API}delete-object/${filename} `);
  }

  public post(url: string, body: any) {
    return this.httpClient.post(url, body); // POST  
  }
}
