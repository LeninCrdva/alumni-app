import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject} from 'rxjs';
import { Empresario } from '../model/empresario';
import { Empresario2 } from '../model/empresario';
import { map } from 'rxjs/operators';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmpresarioDTO } from '../model/DTO/EmpresarioDTO';
@Injectable({
  providedIn: 'root'
})
export class EmpresarioService {

  urlEndPoint = environment.apiURL + '/empresarios';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getEmpresarios(): Observable<Empresario[]> {
    return this.http.get<Empresario[]>(this.urlEndPoint);
  }

  createEmpresario(businessMan: Empresario): Observable<Empresario> {
    return this.http.post<Empresario>(this.urlEndPoint, businessMan, { headers: this.httpHeaders })
  }

  getEmpresarioById(id: any): Observable<Empresario> {
    return this.http.get<Empresario>(`${this.urlEndPoint}/${id}`)
  }

  getBusinessManByUserId(id: any): Observable<EmpresarioDTO> {
    return this.http.get<EmpresarioDTO>(`${this.urlEndPoint}/user-data/${id}`)
  }
  
  getEmpresarios2(): Observable<Empresario2[]> {
    return this.http.get<Empresario2[]>(this.urlEndPoint);
  }
  checkEmpresarioExists(nombre: string): Observable<boolean> {
    return this.getEmpresarios2().pipe(
     // tap(empresarios => console.log('Empresarios obtenidos:', empresarios)),
      map(empresarios => {
        const exists = empresarios.some(empre => 
          empre.usuario && empre.usuario && 
          empre.usuario.toLowerCase() === nombre.toLowerCase()
        );
       // console.log(`¿Existe empresario con nombre ${nombre}? ${exists}`);
        return exists;
      }),
      catchError(error => {
        console.error('Error al verificar la existencia del administrador:', error);
        return of(false); // Devolver false en caso de error
      })
    );
  }

  getEmpresarioByUsuario(usuario: string): Observable<Empresario2 | null> {
    return this.http.get<Empresario2[]>(this.urlEndPoint).pipe(
      
      map((empresarios: Empresario2[]) => {
        //console.log('Empresarios en la respuesta:', empresarios);
        const empresarioEncontrado = empresarios.find(empresario => {
          const usuarioMinusculas = usuario.toLowerCase();
          const empresarioUsuarioMinusculas = empresario.usuario.toLowerCase();
         // console.log('Comparando:', empresarioUsuarioMinusculas, 'con', usuarioMinusculas);
          return empresarioUsuarioMinusculas === usuarioMinusculas;
        });
        return empresarioEncontrado || null;
      }),      
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of(null);
      })
    );
  }
  
  updateEmpresario(id: number, empresario: Empresario): Observable<Empresario> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<Empresario>(url, empresario, { headers: this.httpHeaders });
  }

  updateEmpresarioDTO(id: number, empresarioDTO: EmpresarioDTO): Observable<EmpresarioDTO> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<EmpresarioDTO>(url, empresarioDTO);
  }

  deleteEmpresario(id: number): Observable<Empresario> {
    return this.http.delete<Empresario>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders });
  }  

  private empresarioSubject = new BehaviorSubject<Empresario | null>(null);
  setEmpresario(empresario: Empresario | null): void {
    this.empresarioSubject.next(empresario);
  }
  getEmpresario(): Observable<Empresario | null> {
    return this.empresarioSubject.asObservable();
  }
  
  
}
