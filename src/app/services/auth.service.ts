import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cognitoDomain = environment.cognitoDomain;
  private clientId = environment.cognitoClientId;
  private redirectUri = environment.redirectUri;

  constructor() {
    this.handleAuthCallback();
  }

  login() {
    const authUrl = `${this.cognitoDomain}/login?client_id=${this.clientId}&response_type=token&scope=openid&redirect_uri=${this.redirectUri}`;
    window.location.href = authUrl;
  }

  private handleAuthCallback() {
    const hash = window.location.hash;
    if (hash.includes('id_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('id_token');
      if (token) {
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, "/"); // Limpiar la URL
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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
    debugger;

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
    const storedEmail = localStorage.getItem('login_email');
    return storedEmail ? storedEmail : null;
  }

  getUserCompany_id(): string | null {
    const selectedCompany = localStorage.getItem('selected_company_id');
    if (selectedCompany) {
      return selectedCompany;
    }
    const payload = this.getTokenPayload();
    if (payload && payload['company_id']) {
      return payload['company_id'];
    }
    return '00000000-0000-0000-0000-000000000001';
  }

  logout() {
    localStorage.removeItem('token');
    const logoutUrl = `${this.cognitoDomain}/logout?client_id=${this.clientId}&logout_uri=${this.redirectUri}`;
    window.location.href = logoutUrl;
    setTimeout(() => {
      window.location.href = '/login'; // Redirigir a una página de login después del logout
    }, 500)

  }
}
