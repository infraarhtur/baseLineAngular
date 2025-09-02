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

    // Verificar si existe un token válido y no está expirado
    if (token && !this.authService.isTokenExpired(token)) {
      // Clonar la petición y agregar el header de autorización
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Continuar con la petición modificada
      return next.handle(authRequest);
    }

    // Si no hay token válido, continuar con la petición original
    return next.handle(request);
  }
}
