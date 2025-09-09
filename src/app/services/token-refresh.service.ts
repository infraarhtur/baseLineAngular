import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subscription, throwError } from 'rxjs';
import { switchMap, catchError, tap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenNotificationService } from './token-notification.service';
import { environment } from '../../environments/environment';

export interface TokenRefreshConfig {
  refreshIntervalMinutes: number;
  warningMinutesBeforeExpiry: number;
  autoRefreshEnabled: boolean;
  maxRetryAttempts: number;
  retryDelayMs: number;
  logoutOnRefreshFailure: boolean;
  showRefreshNotifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService {
  private refreshTimer$: Subscription | null = null;
  private isRefreshing$ = new BehaviorSubject<boolean>(false);
  private refreshQueue$ = new BehaviorSubject<boolean[]>([]);
  private config: TokenRefreshConfig;

  constructor(
    private authService: AuthService,
    private tokenNotificationService: TokenNotificationService
  ) {
    this.config = {
      refreshIntervalMinutes: environment.tokenRefreshIntervalMinutes || 5,
      warningMinutesBeforeExpiry: environment.tokenWarningMinutesBeforeExpiry || 10,
      autoRefreshEnabled: environment.autoRefreshEnabled !== false,
      maxRetryAttempts: environment.tokenSettings?.maxRetryAttempts || 3,
      retryDelayMs: environment.tokenSettings?.retryDelayMs || 1000,
      logoutOnRefreshFailure: environment.tokenSettings?.logoutOnRefreshFailure !== false,
      showRefreshNotifications: environment.tokenSettings?.showRefreshNotifications !== false
    };
  }

  /**
   * Inicia el servicio de refresh automático de tokens
   */
  startAutoRefresh(): void {
    if (!this.config.autoRefreshEnabled) {
      return;
    }

    this.stopAutoRefresh(); // Detener cualquier timer existente

    // Iniciar monitoreo de notificaciones
    this.tokenNotificationService.startTokenMonitoring();

    // Verificar inmediatamente si necesita refresh
    this.checkAndRefreshToken();

    // Configurar timer para verificación periódica
    const intervalMs = this.config.refreshIntervalMinutes * 60 * 1000;

    this.refreshTimer$ = timer(intervalMs, intervalMs)
      .pipe(
        tap(() => this.checkAndRefreshToken())
      )
      .subscribe();
  }

  /**
   * Detiene el servicio de refresh automático
   */
  stopAutoRefresh(): void {
    if (this.refreshTimer$) {
      this.refreshTimer$.unsubscribe();
      this.refreshTimer$ = null;
    }

    // Detener monitoreo de notificaciones
    this.tokenNotificationService.stopTokenMonitoring();
  }

  /**
   * Verifica si el token necesita ser refrescado y lo hace si es necesario
   */
  checkAndRefreshToken(): Observable<boolean> {
    if (this.isRefreshing$.value) {
      // Si ya está refrescando, agregar a la cola
      return this.addToRefreshQueue();
    }

    if (!this.authService.isAuthenticated()) {
      return throwError(() => new Error('User not authenticated'));
    }

    if (this.authService.shouldRefreshToken(null, this.config.refreshIntervalMinutes)) {
      return this.refreshToken();
    }

    return new Observable(observer => {
      observer.next(false);
      observer.complete();
    });
  }

  /**
   * Refresca el token de manera segura
   */
  refreshToken(): Observable<boolean> {
    if (this.isRefreshing$.value) {
      return this.addToRefreshQueue();
    }

    this.isRefreshing$.next(true);

    return this.authService.refreshToken().pipe(
      tap((tokens) => {
        console.log('Token refreshed successfully');
        this.tokenNotificationService.showRefreshSuccess();
        this.processRefreshQueue();
      }),
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.tokenNotificationService.showRefreshError();
        this.handleRefreshError(error);
        return throwError(() => error);
      }),
      switchMap(() => {
        this.isRefreshing$.next(false);
        return new Observable<boolean>(observer => {
          observer.next(true);
          observer.complete();
        });
      })
    );
  }

  /**
   * Agrega una petición a la cola de refresh
   */
  private addToRefreshQueue(): Observable<boolean> {
    return new Observable(observer => {
      const queueId = Date.now();
      const currentQueue = this.refreshQueue$.value;
      this.refreshQueue$.next([...currentQueue, true]);

      // Esperar a que termine el refresh actual
      this.isRefreshing$.pipe(
        filter(refreshing => !refreshing),
        take(1)
      ).subscribe(() => {
        observer.next(true);
        observer.complete();
      });
    });
  }

  /**
   * Procesa la cola de refresh después de un refresh exitoso
   */
  private processRefreshQueue(): void {
    const currentQueue = this.refreshQueue$.value;
    if (currentQueue.length > 0) {
      this.refreshQueue$.next([]);
      // Notificar a todas las peticiones en cola
      currentQueue.forEach(() => {
        // Las peticiones en cola ya fueron notificadas por el observable
      });
    }
  }

  /**
   * Maneja errores durante el refresh del token
   */
  private handleRefreshError(error: any): void {
    this.isRefreshing$.next(false);
    this.refreshQueue$.next([]);

    // Si el refresh token también expiró, hacer logout
    if (this.shouldLogoutOnError(error)) {
      console.warn('Refresh token expired or failed, logging out user');
      this.tokenNotificationService.showLogoutNotification();
      this.authService.logout();
    } else {
      // Para otros errores, también hacer logout para asegurar consistencia
      console.warn('Token refresh failed, logging out user');
      this.authService.logout();
    }
  }

  /**
   * Determina si se debe hacer logout basado en el error
   */
  private shouldLogoutOnError(error: any): boolean {
    // Errores que requieren logout
    const logoutErrors = [
      'expired',
      'invalid',
      'unauthorized',
      'forbidden'
    ];

    // Verificar mensaje de error
    const errorMessage = error.message?.toLowerCase() || '';
    const hasLogoutError = logoutErrors.some(logoutError =>
      errorMessage.includes(logoutError)
    );

    // Verificar códigos de estado HTTP
    const logoutStatusCodes = [401, 403];
    const hasLogoutStatusCode = logoutStatusCodes.includes(error.status);

    // Verificar si el refresh token está expirado
    const refreshTokenExpired = this.authService.isRefreshTokenExpired();

    return hasLogoutError || hasLogoutStatusCode || refreshTokenExpired;
  }

  /**
   * Obtiene el estado actual del refresh
   */
  isRefreshing(): Observable<boolean> {
    return this.isRefreshing$.asObservable();
  }

  /**
   * Obtiene información sobre el tiempo hasta expiración del token
   */
  getTokenExpiryInfo(): { minutesUntilExpiry: number; shouldRefresh: boolean; isExpiringSoon: boolean } {
    const minutesUntilExpiry = this.authService.getTokenMinutesUntilExpiry();
    const shouldRefresh = this.authService.shouldRefreshToken(null, this.config.refreshIntervalMinutes);
    const isExpiringSoon = this.authService.isTokenExpiringSoon(null, this.config.warningMinutesBeforeExpiry);

    return {
      minutesUntilExpiry,
      shouldRefresh,
      isExpiringSoon
    };
  }

  /**
   * Actualiza la configuración del servicio
   */
  updateConfig(newConfig: Partial<TokenRefreshConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Reiniciar el servicio si está activo
    if (this.refreshTimer$) {
      this.startAutoRefresh();
    }
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): TokenRefreshConfig {
    return { ...this.config };
  }

  /**
   * Verifica si el servicio está activo
   */
  isActive(): boolean {
    return this.refreshTimer$ !== null && !this.refreshTimer$.closed;
  }

  /**
   * Limpia recursos al destruir el servicio
   */
  ngOnDestroy(): void {
    this.stopAutoRefresh();
    this.isRefreshing$.complete();
    this.refreshQueue$.complete();
  }
}
