import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface TokenNotificationConfig {
  showNotifications: boolean;
  warningMinutesBeforeExpiry: number;
  notificationDuration: number;
  autoHideNotifications: boolean;
}

export interface TokenNotification {
  type: 'warning' | 'error' | 'success' | 'info';
  message: string;
  action?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenNotificationService {
  private config: TokenNotificationConfig;
  private notificationSubject = new BehaviorSubject<TokenNotification | null>(null);
  private warningTimer$: any = null;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.config = {
      showNotifications: environment.tokenSettings?.showRefreshNotifications !== false,
      warningMinutesBeforeExpiry: environment.tokenWarningMinutesBeforeExpiry || 10,
      notificationDuration: 5000, // 5 segundos por defecto
      autoHideNotifications: true
    };
  }

  /**
   * Inicia el monitoreo de notificaciones de token
   */
  startTokenMonitoring(): void {
    if (!this.config.showNotifications) {
      return;
    }

    this.stopTokenMonitoring(); // Detener cualquier monitoreo existente

    // Verificar inmediatamente
    this.checkAndShowWarning();

    // Configurar timer para verificación periódica cada minuto
    this.warningTimer$ = timer(60000, 60000)
      .pipe(take(1))
      .subscribe(() => {
        this.checkAndShowWarning();
        this.startTokenMonitoring(); // Reiniciar el timer
      });
  }

  /**
   * Detiene el monitoreo de notificaciones
   */
  stopTokenMonitoring(): void {
    if (this.warningTimer$) {
      this.warningTimer$.unsubscribe();
      this.warningTimer$ = null;
    }
  }

  /**
   * Verifica si debe mostrar advertencia y la muestra
   */
  private checkAndShowWarning(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const minutesUntilExpiry = this.authService.getTokenMinutesUntilExpiry();
    const isExpiringSoon = this.authService.isTokenExpiringSoon(null, this.config.warningMinutesBeforeExpiry);

    if (isExpiringSoon && minutesUntilExpiry > 0) {
      this.showTokenExpiryWarning(minutesUntilExpiry);
    }
  }

  /**
   * Muestra advertencia de expiración de token
   */
  showTokenExpiryWarning(minutesUntilExpiry: number): void {
    if (!this.config.showNotifications) {
      return;
    }

    const message = this.getExpiryWarningMessage(minutesUntilExpiry);

    this.showNotification({
      type: 'warning',
      message: message,
      action: 'Refrescar',
      duration: this.config.notificationDuration
    });
  }

  /**
   * Genera mensaje de advertencia basado en tiempo restante
   */
  private getExpiryWarningMessage(minutesUntilExpiry: number): string {
    if (minutesUntilExpiry <= 1) {
      return 'Tu sesión expirará en menos de 1 minuto. Se refrescará automáticamente.';
    } else if (minutesUntilExpiry <= 5) {
      return `Tu sesión expirará en ${Math.floor(minutesUntilExpiry)} minutos. Se refrescará automáticamente.`;
    } else {
      return `Tu sesión expirará en ${Math.floor(minutesUntilExpiry)} minutos.`;
    }
  }

  /**
   * Muestra notificación de refresh exitoso
   */
  showRefreshSuccess(): void {
    if (!this.config.showNotifications) {
      return;
    }

    this.showNotification({
      type: 'success',
      message: 'Sesión renovada exitosamente',
      duration: 3000
    });
  }

  /**
   * Muestra notificación de error en refresh
   */
  showRefreshError(): void {
    if (!this.config.showNotifications) {
      return;
    }

    this.showNotification({
      type: 'error',
      message: 'Error al renovar la sesión. Serás redirigido al login.',
      duration: 5000
    });
  }

  /**
   * Muestra notificación de logout automático
   */
  showLogoutNotification(): void {
    if (!this.config.showNotifications) {
      return;
    }

    this.showNotification({
      type: 'info',
      message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      duration: 5000
    });
  }

  /**
   * Muestra notificación personalizada
   */
  showNotification(notification: TokenNotification): void {
    if (!this.config.showNotifications) {
      return;
    }

    const config: MatSnackBarConfig = {
      duration: this.config.autoHideNotifications ? notification.duration || this.config.notificationDuration : 0,
      panelClass: [`token-notification-${notification.type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    };

    const snackBarRef = this.snackBar.open(
      notification.message,
      notification.action,
      config
    );

    // Si hay acción, manejar el click
    if (notification.action && notification.action === 'Refrescar') {
      snackBarRef.onAction().subscribe(() => {
        // Aquí podrías llamar al servicio de refresh si es necesario
        console.log('Usuario solicitó refresh manual');
        this.authService.refreshToken();
      });
    }

    // Emitir notificación al subject
    this.notificationSubject.next(notification);
  }

  /**
   * Obtiene el observable de notificaciones
   */
  getNotifications(): Observable<TokenNotification | null> {
    return this.notificationSubject.asObservable();
  }

  /**
   * Actualiza la configuración
   */
  updateConfig(newConfig: Partial<TokenNotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Reiniciar monitoreo si está activo
    if (this.warningTimer$) {
      this.startTokenMonitoring();
    }
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): TokenNotificationConfig {
    return { ...this.config };
  }

  /**
   * Verifica si el servicio está activo
   */
  isActive(): boolean {
    return this.warningTimer$ !== null;
  }

  /**
   * Limpia recursos al destruir el servicio
   */
  ngOnDestroy(): void {
    this.stopTokenMonitoring();
    this.notificationSubject.complete();
  }
}
