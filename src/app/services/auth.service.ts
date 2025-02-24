import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cognitoDomain = 'https://us-east-1cifmpvh0b.auth.us-east-1.amazoncognito.com';
  private clientId = '2kgl9phf326v4ts8sudrdapjsp';
  private redirectUri = 'http://localhost:4200/';

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
