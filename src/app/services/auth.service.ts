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

  logout() {
    debugger;
    localStorage.removeItem('token');
    const logoutUrl = `${this.cognitoDomain}/logout?client_id=${this.clientId}&logout_uri=${this.redirectUri}`;
    window.location.href = logoutUrl;
    setTimeout(() => {
      window.location.href = '/login'; // Redirigir a una página de login después del logout
    }, 500)

  }
}
