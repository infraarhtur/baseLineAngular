import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authBaseUrl = `${environment.apiUrlAuth}`;
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private router: Router) {}
  login(email: string, password: string, company_name: string, remember_me: boolean): Observable<boolean> {
    const url = `${this.authBaseUrl}auth/login`;
    //const remember_me= true;
    return this.http
      .post<{
        token?: string;
        access_token?: string;
        idToken?: string;
        refresh_token?: string;
        refreshToken?: string;
      }>(url, {
        email,
        password,
        company_name,
        remember_me
      })
      .pipe(
        tap((response) => {
          // Obtener el access token (prioridad: token > access_token > idToken)
          const accessToken = response?.token || response?.access_token || response?.idToken;

          // Obtener el refresh token (prioridad: refresh_token > refreshToken)
          const refreshToken = response?.refresh_token || response?.refreshToken;

          if (accessToken) {
            localStorage.setItem('token', accessToken);

            // Almacenar refresh token si está disponible
            if (refreshToken) {
              this.setRefreshToken(refreshToken);
            }

            this.router.navigate(['/home']);
          }
        }),
        map(() => true)
      );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh_token', refreshToken);
  }

  removeRefreshToken(): void {
    localStorage.removeItem('refresh_token');
  }

  isRefreshTokenExpired(refreshToken?: string | null): boolean {
    const token = refreshToken ?? this.getRefreshToken();
    if (!token) return true;
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= payload.exp;
  }

  isTokenExpiringSoon(token?: string | null, minutesBeforeExpiry: number = 5): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    const payload = this.decodeToken(t);
    if (!payload || !payload.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    const expiryTime = payload.exp;
    const timeUntilExpiry = expiryTime - nowSec;
    const minutesUntilExpiry = timeUntilExpiry / 60;
    return minutesUntilExpiry <= minutesBeforeExpiry;
  }

  getTokenTimeUntilExpiry(token?: string | null): number {
    const t = token ?? this.getToken();
    if (!t) return 0;
    const payload = this.decodeToken(t);
    if (!payload || !payload.exp) return 0;
    const nowSec = Math.floor(Date.now() / 1000);
    const expiryTime = payload.exp;
    return Math.max(0, expiryTime - nowSec);
  }

  getTokenMinutesUntilExpiry(token?: string | null): number {
    const secondsUntilExpiry = this.getTokenTimeUntilExpiry(token);
    return Math.floor(secondsUntilExpiry / 60);
  }

  shouldRefreshToken(token?: string | null, minutesBeforeExpiry: number = 5): boolean {
    return this.isTokenExpiringSoon(token, minutesBeforeExpiry) && !this.isTokenExpired(token);
  }

  private base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    return atob(base64 + pad);
  }

  decodeToken(token: string): any | null {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;
      const json = this.base64UrlDecode(payloadPart);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getTokenPayload(): any | null {

    const token = this.getToken();
    return token ? this.decodeToken(token) : null;


  }

  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    const payload = this.decodeToken(t);
    if (!payload || !payload.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= payload.exp;
  }

  getUserName(): string | null {
    const payload = this.getTokenPayload();
    if (payload && payload['email']) {
      return payload['email'];
    }
    return null;
  }

  getUserCompany_id(): string | null {
    const payload = this.getTokenPayload();
    if (payload && payload['company_id']) {
      return payload['company_id'];
    }
    return null;
  }

  getUserCompanyName(): string | null {
    const payload = this.getTokenPayload();
    if (payload && payload['company_name']) {
      return payload['company_name'];
    }
    return null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
  resetPassword(email: string): Observable<any> {
    const url = `${this.authBaseUrl}auth/password-reset`;
    return this.http.post<any>(url, { email });
  }
  validateToken(token: string): Observable<any> {
    const url = `${this.authBaseUrl}auth/password-reset/validate`;
    return this.http.get<any>(url, { params: { token } });
  }
  resetPasswordConfirm(token: string, new_password: string): Observable<any> {
    const url = `${this.authBaseUrl}auth/password-reset/confirm`;
    return this.http.post<any>(url, { token, new_password });
  }

  refreshToken(): Observable<{ access_token: string; refresh_token?: string }> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (this.isRefreshTokenExpired(refreshToken)) {
      throw new Error('Refresh token has expired');
    }

    const url = `${this.authBaseUrl}auth/refresh-token`;

    return this.http.post<{
      access_token: string;
      refresh_token?: string;
      token?: string;
    }>(url, { refresh_token: refreshToken })
      .pipe(
        tap((response) => {
          // Obtener el nuevo access token
          const newAccessToken = response.access_token || response.token;

          if (newAccessToken) {
            // Actualizar el access token
            localStorage.setItem('token', newAccessToken);

            // Actualizar el refresh token si viene uno nuevo
            if (response.refresh_token) {
              this.setRefreshToken(response.refresh_token);
            }
          }
        }),
        map((response) => ({
          access_token: response.access_token || response.token || '',
          refresh_token: response.refresh_token
        }))
      );
  }
}
