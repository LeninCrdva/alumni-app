import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graduado } from '../model/graduado';
import { Graduado3 } from '../model/graduado';
import { Graduado4 } from '../model/graduado';
import { Graduado1 } from '../model/graduado';
import { map } from 'rxjs/operators';
import { ofertaLaboral } from '../model/ofertaLaboral';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { GraduadoDTO } from '../model/DTO/GraduadoDTO';

@Injectable({
  providedIn: 'root'
})
export class GraduadoService {

  urlEndPoint = environment.apiURL + '/graduados';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getGraduados(): Observable<Graduado[]> {
    return this.http.get<Graduado[]>(this.urlEndPoint);
  }

  getGraduadosDTO(): Observable<GraduadoDTO[]> {
    return this.http.get<GraduadoDTO[]>(this.urlEndPoint);
  }

  createGraduado(graduado: Graduado): Observable<Graduado> {
    return this.http.post<Graduado>(this.urlEndPoint, graduado, { headers: this.httpHeaders })
  }

  getGraduadoById(id: any): Observable<Graduado> {
    return this.http.get<Graduado>(`${this.urlEndPoint}/${id}`)
  }

  getGraduadoWithPdfId(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/with-pdf/${id}`)
  }
  //llenado de informacion 
  getGraduados2(): Observable<Graduado3[]> {
    return this.http.get<Graduado3[]>(this.urlEndPoint);
  }

  getCareerListByGraduateId(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/mis-carreras/${id}`);
  }

  createGraduado2(graduado2: Graduado3): Observable<Graduado3> {
    return this.http.post<Graduado3>(this.urlEndPoint, graduado2, { headers: this.httpHeaders })
  }

  createGraduadoDTO(graduadoDTO: GraduadoDTO): Observable<GraduadoDTO> {
    return this.http.post<GraduadoDTO>(this.urlEndPoint, graduadoDTO, { headers: this.httpHeaders })
  }

  checkGraduadoExists(nombre: string): Observable<boolean> {
    return this.getGraduados2().pipe(
     // tap(graduados => console.log('Administradores obtenidos:', graduados)),
      map(graduados => {
        const exists = graduados.some(gradu =>
          gradu.usuario && gradu.usuario &&
          gradu.usuario.toLowerCase() === nombre.toLowerCase()
        );
       // console.log(`¿Existe administrador con nombre ${nombre}? ${exists}`);
        return exists;
      }),
      catchError(error => {
        console.error('Error al verificar la existencia del administrador:', error);
        return of(false); // Devolver false en caso de error
      })
    );
  }
  getGraduadoByUsuario(usuario: string|null): Observable<Graduado3 | null> {
    const usuarioMayusculas = usuario ? usuario.toUpperCase() : null; 
    return this.http.get<Graduado3[]>(this.urlEndPoint).pipe(
      map(graduados => graduados.find(graduado => graduado.usuario === usuarioMayusculas) || null)
    );
  }
  getGraduadoByUsuario2(usuario: string|null): Observable<Graduado4 | null> {
    const usuarioMayusculas = usuario ? usuario.toUpperCase() : null; 
    return this.http.get<Graduado4[]>(this.urlEndPoint).pipe(
      map(graduados => graduados.find(graduado => graduado.usuario === usuarioMayusculas) || null)
    );
  }

  getGraduadoByUserId(idUser: any): Observable<Graduado> {
    return this.http.get<Graduado>(`${this.urlEndPoint}/usuario/${idUser}`);
  }

  getGraduadoDTOByUserId(idUser: number): Observable<GraduadoDTO> {
    return this.http.get<GraduadoDTO>(`${this.urlEndPoint}/usuario/${idUser}`);
  }

  //Dont consume this method
  updateOfferInGraduado(graduado: GraduadoDTO, idGraduado: number): Observable<GraduadoDTO> {
    return this.http.put<GraduadoDTO>(`${this.urlEndPoint}/postulaciones/${idGraduado}`, graduado, { headers: this.httpHeaders })
  }

  //Dont consume this method
  cancelOfferInGraduado(graduado: GraduadoDTO, idGraduado: number): Observable<GraduadoDTO> {
    return this.http.put<GraduadoDTO>(`${this.urlEndPoint}/cancel-postulaciones/${idGraduado}`, graduado, { headers: this.httpHeaders })
  }

  getOfertasLaboralesByUsername(username: string): Observable<ofertaLaboral[]> {
    return this.http.get<ofertaLaboral[]>(`${this.urlEndPoint}/user/${username}`);
  }

  getGraduadoByUsuarioId(id: any): Observable<GraduadoDTO> {
    return this.http.get<GraduadoDTO>(`${this.urlEndPoint}/usuario/${id}`)
  }

  updateGraduateWithoutTitle(id: any, graduado: GraduadoDTO): Observable<GraduadoDTO> {
    const url = `${this.urlEndPoint}/without-title/${id}`;
    return this.http.put<GraduadoDTO>(url, graduado,);
  }

  getGraduadosWithOutOferta(): Observable<Graduado[]> {
    return this.http.get<Graduado[]>(`${this.urlEndPoint}/without-oferta`);
  }
  getGraduadoSinPostular(): Observable<Graduado1[]> {
    return this.http.get<Graduado1[]>(`${this.urlEndPoint}/without-oferta`);
  }
  getGraduadoConPostulacion(): Observable<Graduado1[]> {
    return this.http.get<Graduado1[]>(`${this.urlEndPoint}/with-oferta`);
  }
  searchGraduadosByUsuario(usuario: string): Observable<Graduado3[]> {
    return this.http.get<Graduado3[]>(this.urlEndPoint).pipe(
      map(graduados => {
        console.log('Nombres de usuario en la lista:', graduados.map(graduado => graduado.usuario));
        return graduados.filter(graduado => graduado.usuario.toLowerCase().includes(usuario.toLowerCase()));
      })
    );
  }

  getByUsuarioId(id: any): Observable<GraduadoDTO> {
    return this.http.get<GraduadoDTO>(`${this.urlEndPoint}/usuario/${id}`)
  }

  updateGraduadoDTO(id: any, graduado: GraduadoDTO): Observable<GraduadoDTO> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.put<GraduadoDTO>(url, graduado, { headers: this.httpHeaders });
  }
  getGraduadosWithoutDTO(): Observable<Graduado1[]> {
    return this.http.get<Graduado1[]>(`${this.urlEndPoint}/all`);
  }
  getGraduadosNotIn(id:number): Observable<Graduado[]> {
    return this.http.get<Graduado[]>(`${this.urlEndPoint}/otros-graduados/${id}`);
  }
  getGraduadoSinExperiencia(): Observable<Graduado1[]> {
    return this.http.get<Graduado1[]>(`${this.urlEndPoint}/sin-experiencia`)
  }

}
