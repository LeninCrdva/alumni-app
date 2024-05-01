import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecoveryDTO } from '../model/Mail/RecoveryDTO';
import { Empresa } from '../model/empresa';
import { GraduadoDTO } from '../model/DTO/GraduadoDTO';
import { Empresario } from '../model/empresario';
import { environment } from '../../../environments/environment';
import { EmpresarioDTO } from '../model/DTO/EmpresarioDTO';
import { EmpresaDTO } from '../model/DTO/EmpresaDTO';

interface SignupRequestBody {
  usuarioDTO: any;
  empresarioDTO?: any;
  empresaDTO?: any;
  graduadoDTO?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiURL + '/auth';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const loginDTO = { username, password };
    return this.http.post(`${this.baseUrl}/login`, loginDTO);
  }

  // signup(usuarioDTO: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/signup`, usuarioDTO);
  // }

  signup(usuarioDTO: any, empresarioDTO?: EmpresarioDTO, empresaDTO?: EmpresaDTO, graduadoDTO?: GraduadoDTO,): Observable<any> {
    const requestBody: SignupRequestBody = {
      usuarioDTO,
      ...(empresarioDTO && { empresarioDTO }),
      ...(empresaDTO && { empresaDTO }),
      ...(graduadoDTO && { graduadoDTO }),
    };
    return this.http.post(`${this.baseUrl}/signup`, requestBody);
  }

  signupAdmin(registroDTO: any): Observable<any> {
    
    return this.http.post(`${this.baseUrl}/signup/admin`, registroDTO);
  }

  resetPassword(recoveryDto: RecoveryDTO): Observable<RecoveryDTO> {
    const url = `${this.baseUrl}/login/recovery-password`;
    return this.http.put<RecoveryDTO>(url, recoveryDto, { headers: this.httpHeaders })
  }
}
