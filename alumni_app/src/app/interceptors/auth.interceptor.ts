import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { LocalStorageKeys, clearLocalStorage, getToken, getTokenTimeOut } from './local-storage-manager';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlertsService } from '../data/Alerts.service';

@Injectable()
export class LoaderPeticionesInterceptor implements HttpInterceptor {

  constructor(private router: Router, private alertService: AlertsService) { }

  private _activeRequest = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.alertService.mostrarAlertaCargando("Procesando solicitud...");

    const token = getToken(LocalStorageKeys.TOKEN);

    if (token) {
      if (getTokenTimeOut(token)) {
        return this.handleTokenTimeout();
      }

      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (event.status >= 200 && event.status < 300) {
            this.alertService.detenerAlertaCargando();
          } else {
            this.alertService.mostrarAlertaMomentanea("Se ha producido un error", false);
          }
        }
      }),
      catchError((error) => {
        this.alertService.mostrarAlertaMomentanea("Se ha producido un error", false);
        return throwError(error);
      })
    );    
  }

  private handleTokenTimeout(): Observable<HttpEvent<unknown>> {
    this.openMessage();

    setTimeout(() => {
      clearLocalStorage();
      this.router.navigate(['/login']).then(() => { window.location.reload(); });
    }, 1500);
    return throwError('Token timeout');
  }

  private openMessage() {
    Swal.fire({
      icon: "info",
      title: "¡Tu sesión ha expirado!",
      showConfirmButton: false,
      timer: 1500
    });
  }
}
