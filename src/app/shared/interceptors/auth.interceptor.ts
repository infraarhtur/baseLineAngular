import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { TokenRefreshService } from '../../services/token-refresh.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private tokenRefreshService: TokenRefreshService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verificar si es una ruta de autenticación (no necesita token)
    const isAuthRoute = request.url.includes('/auth/');

    // Obtener el token del AuthService
    const token = this.authService.getToken();
//identifica si la ruta es publica
    const currentUrl = window.location.toString().split('/')[3];
    console.log('interceptor- Current URL:', currentUrl);
    const publicRoutes = ['login', 'token-validate', 'reset-password', 'reset-password-confirm', 'email-validate'];
    const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));

    // Si hay token, verificar si necesita refrescarse antes de enviar la petición
    if (!isAuthRoute && token && this.authService.isAuthenticated()) {
      const minutesBeforeExpiry = environment.tokenSettings.tokenWarningMinutesBeforeExpiry;
      if (this.authService.shouldRefreshToken(token, minutesBeforeExpiry)) {
        // El token está por expirar, refrescarlo antes de enviar la petición
        return this.refreshTokenBeforeRequest(request, next);
      }
    }

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
      // Excluir rutas de autenticación que no necesitan company_id

      if (request.method === 'POST' && request.body && companyId && !isAuthRoute) {
        const bodyWithCompanyId = {
          ...request.body as any,
          company_id: companyId
        };

        modifiedRequest = modifiedRequest.clone({
          body: bodyWithCompanyId
        });
      }
    }

    // Continuar con la petición y manejar errores 401
    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.isAuthenticated()) {
          return this.handle401Error(request, next);
        }
        if (!this.authService.isAuthenticated()) {
          console.log('isPublicRoute', isPublicRoute);
          if (isPublicRoute) {
            console.log('isPublicRoute',' this.authService.logout()');
            this.authService.logout();
          } else {
            console.log( 'no una ruta isPublicRoute', ' this.authService.logoutForceRedirect();');
            this.authService.logoutForceRedirect();
          }
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      // Si ya está refrescando, esperar a que termine
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => this.retryRequest(request, next))
      );
    }

    // Iniciar el refresh
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.tokenRefreshService.refreshToken().pipe(

      switchMap((success: boolean) => {
        this.isRefreshing = false;

        if (success) {
          this.refreshTokenSubject.next(success);
          return this.retryRequest(request, next);
        } else {
          this.refreshTokenSubject.next(null);
          // Limpiar tokens y redirigir al login
          this.authService.logoutForceRedirect();
          return throwError(() => new Error('Token refresh failed'));
        }
      }),
      catchError((error) => {
        ;
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        // Limpiar tokens y redirigir al login
        this.authService.logoutForceRedirect();
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresca el token antes de enviar la petición si está próximo a expirar
   */
  private refreshTokenBeforeRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Si ya está refrescando, esperar y reutilizar el resultado
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => this.retryRequest(request, next))
      );
    }

    // Iniciar el proceso de refresh
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.tokenRefreshService.refreshToken().pipe(
      switchMap((success: boolean) => {
        this.isRefreshing = false;
        if (success) {
          this.refreshTokenSubject.next(success);
          return this.retryRequest(request, next);
        } else {
          this.refreshTokenSubject.next(null);
          // Si falla el refresh, hacer logout
          this.authService.logoutForceRedirect();
          return throwError(() => new Error('Token refresh failed'));
        }
      }),
      catchError((error) => {

        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        // Si hay error, hacer logout
        this.authService.logoutForceRedirect();
        return throwError(() => error);
      })
    );
  }

  private retryRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      // Obtener el company_id del token
      const companyId = this.authService.getUserCompany_id();

      // Clonar la petición con el nuevo token
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Si es una petición POST y tiene body, añadir company_id
      // Excluir rutas de autenticación que no necesitan company_id
      const isAuthRoute = request.url.includes('/auth/');
      if (request.method === 'POST' && request.body && companyId && !isAuthRoute) {
        const bodyWithCompanyId = {
          ...request.body as any,
          company_id: companyId
        };

        return next.handle(modifiedRequest.clone({
          body: bodyWithCompanyId
        }));
      }

      return next.handle(modifiedRequest);
    }

    return throwError(() => new Error('No token available after refresh'));
  }
}
