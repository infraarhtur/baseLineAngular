import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { TokenRefreshService } from '../../../services/token-refresh.service';
import { TokenNotificationService, TokenNotification } from '../../../services/token-notification.service';

@Component({
  selector: 'app-token-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="token-status" *ngIf="showTokenStatus">
      <mat-card class="token-card">
        <mat-card-header>
          <mat-card-title>Estado de la Sesión</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="token-info">
            <p><strong>Tiempo restante:</strong> {{ minutesUntilExpiry }} minutos</p>
            <p><strong>Estado:</strong>
              <span [class]="getStatusClass()">{{ getStatusText() }}</span>
            </p>
            <p><strong>Refresh automático:</strong>
              <span [class]="autoRefreshActive ? 'status-active' : 'status-inactive'">
                {{ autoRefreshActive ? 'Activo' : 'Inactivo' }}
              </span>
            </p>
          </div>

          <div class="token-actions" *ngIf="canRefresh">
            <button mat-raised-button
                    color="primary"
                    (click)="refreshToken()"
                    [disabled]="isRefreshing">
              <mat-icon>refresh</mat-icon>
              Refrescar Sesión
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- Notificaciones -->
    <div class="notifications" *ngIf="currentNotification">
      <mat-card [class]="'notification-' + currentNotification.type">
        <mat-card-content>
          <div class="notification-content">
            <mat-icon>{{ getNotificationIcon() }}</mat-icon>
            <span>{{ currentNotification.message }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .token-status {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 300px;
    }

    .token-card {
      background: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .token-info p {
      margin: 8px 0;
    }

    .status-active {
      color: #4caf50;
      font-weight: bold;
    }

    .status-inactive {
      color: #f44336;
      font-weight: bold;
    }

    .status-warning {
      color: #ff9800;
      font-weight: bold;
    }

    .status-expired {
      color: #f44336;
      font-weight: bold;
    }

    .token-actions {
      margin-top: 16px;
      text-align: center;
    }

    .notifications {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      max-width: 400px;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-warning {
      background-color: #ff9800;
      color: white;
    }

    .notification-error {
      background-color: #f44336;
      color: white;
    }

    .notification-success {
      background-color: #4caf50;
      color: white;
    }

    .notification-info {
      background-color: #2196f3;
      color: white;
    }

    @media (max-width: 768px) {
      .token-status {
        position: relative;
        top: auto;
        right: auto;
        margin: 16px;
        max-width: none;
      }

      .notifications {
        position: relative;
        top: auto;
        left: auto;
        margin: 16px;
        max-width: none;
      }
    }
  `]
})
export class TokenStatusComponent implements OnInit, OnDestroy {
  showTokenStatus = false;
  minutesUntilExpiry = 0;
  autoRefreshActive = false;
  isRefreshing = false;
  canRefresh = false;
  currentNotification: TokenNotification | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private tokenRefreshService: TokenRefreshService,
    private tokenNotificationService: TokenNotificationService
  ) {}

  ngOnInit(): void {
    // Solo mostrar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      this.showTokenStatus = true;
      this.updateTokenInfo();

      // Suscribirse a cambios en el estado de refresh
      this.subscriptions.push(
        this.tokenRefreshService.isRefreshing().subscribe(refreshing => {
          this.isRefreshing = refreshing;
        })
      );

      // Suscribirse a notificaciones
      this.subscriptions.push(
        this.tokenNotificationService.getNotifications().subscribe(notification => {
          this.currentNotification = notification;

          // Auto-ocultar notificación después de 5 segundos
          if (notification) {
            setTimeout(() => {
              this.currentNotification = null;
            }, 5000);
          }
        })
      );

      // Actualizar información cada minuto
      setInterval(() => {
        this.updateTokenInfo();
      }, 60000);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateTokenInfo(): void {
    if (this.authService.isAuthenticated()) {
      this.minutesUntilExpiry = this.authService.getTokenMinutesUntilExpiry();
      this.autoRefreshActive = this.tokenRefreshService.isActive();
      this.canRefresh = this.authService.getRefreshToken() !== null &&
                       !this.authService.isRefreshTokenExpired();
    }
  }

  getStatusClass(): string {
    if (this.minutesUntilExpiry <= 0) {
      return 'status-expired';
    } else if (this.minutesUntilExpiry <= 5) {
      return 'status-warning';
    } else {
      return 'status-active';
    }
  }

  getStatusText(): string {
    if (this.minutesUntilExpiry <= 0) {
      return 'Expirado';
    } else if (this.minutesUntilExpiry <= 5) {
      return 'Próximo a expirar';
    } else {
      return 'Activo';
    }
  }

  getNotificationIcon(): string {
    if (!this.currentNotification) return '';

    switch (this.currentNotification.type) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'check_circle';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  refreshToken(): void {
    if (this.canRefresh && !this.isRefreshing) {
      this.tokenRefreshService.refreshToken().subscribe({
        next: (success) => {
          if (success) {
            this.updateTokenInfo();
          }
        },
        error: (error) => {
          console.error('Error refreshing token:', error);
        }
      });
    }
  }
}
