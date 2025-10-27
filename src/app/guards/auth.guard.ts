import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenRefreshService } from '../services/token-refresh.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenRefreshService: TokenRefreshService
  ) {}

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Si no está autenticado pero tiene refresh token, intentar refresh
    if (this.authService.getRefreshToken() && !this.authService.isRefreshTokenExpired()) {
      return this.attemptTokenRefresh();
    }

    // Si no hay refresh token o está expirado, limpiar tokens y redirigir a login
    this.authService.logoutForceRedirect();
    return this.router.parseUrl('/login');
  }

  /**
   * Intenta refrescar el token antes de denegar acceso
   */
  private attemptTokenRefresh(): Observable<boolean | UrlTree> {
    return this.tokenRefreshService.refreshToken().pipe(
      map((success: boolean) => {
        if (success) {
          return true; // Token refrescado exitosamente
        } else {
          return this.router.parseUrl('/login'); // Falló el refresh
        }
      }),
      catchError((error) => {
        console.warn('Token refresh failed in AuthGuard:', error);
        return of(this.router.parseUrl('/login')); // Error en refresh
      })
    );
  }
}


