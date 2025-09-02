import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del AuthService
    const token = this.authService.getToken();
    let modifiedRequest = request;

    // Verificar si existe un token válido y no está expirado
    if (token && !this.authService.isTokenExpired(token)) {
      // Obtener el company_id del token
      const companyId = this.authService.getUserCompany_id();

      // Clonar la petición y agregar el header de autorización
      modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Si es una petición POST y tiene body, añadir company_id
      if (request.method === 'POST' && request.body && companyId) {
        const bodyWithCompanyId = {
          ...request.body as any,
          company_id: companyId
        };

        modifiedRequest = modifiedRequest.clone({
          body: bodyWithCompanyId
        });
      }
    }

    // Continuar con la petición (modificada o original)
    return next.handle(modifiedRequest);
  }
}
