import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { componentxml } from '../model/componentxml';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class XmlserviceService {

  urlEndPoint = environment.apiURL + '/componentxml';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  get(): Observable<componentxml[]> {
    return this.http.get<componentxml[]>(`${this.urlEndPoint}/list`);
  }

  create(blogItem: any): Observable<componentxml> {
    return this.http.post<componentxml>(`${this.urlEndPoint}/create`, blogItem);
  }

  createFromJSON(blogItem: any): Observable<componentxml> {
    return this.http.post<componentxml>(`${this.urlEndPoint}/createFromJSON`, blogItem);
  }

  listXMLWithFilter(filter: string): Observable<componentxml[]> {
    const url = `${this.urlEndPoint}/list`;
    return this.http.get<componentxml[]>(url).pipe(
      map(data => data.filter(item => item.tipo.startsWith(filter)))
    );
  }
  
  listXMLWithFilterProgram(filter: string): Observable<componentxml[]> {
    const url = `${this.urlEndPoint}/list`;
    return this.http.get<componentxml[]>(url).pipe(
      map(data => data.filter(item => !item.tipo.startsWith(filter)))
    );
  }

  getById(id: any): Observable<componentxml> {
    return this.http.get<componentxml>(`${this.urlEndPoint}/findbyId/${id}`)
  }

  getByTipo(tipo: string): Observable<componentxml> {
    return this.http.get<componentxml>(`${this.urlEndPoint}/findByTipo/${tipo}`)
  }

  update(id: any, blogItem: any): Observable<componentxml> {
    return this.http.put<componentxml>(`${this.urlEndPoint}/update/${id}`, blogItem);
  }

  delete(id: any): Observable<void> {
    const url = `${this.urlEndPoint}/delete/${id}`;
    return this.http.delete<void>(url, { headers: this.httpHeaders });
  }
}
