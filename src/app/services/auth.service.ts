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
  login(email: string, hashed_password: string, company_name: string, remember_me: boolean): Observable<boolean> {
    const url = `${this.authBaseUrl}auth/login`;
    //const remember_me= true;
    return this.http
      .post<{ token?: string; access_token?: string; idToken?: string }>(url, {
        email,
        hashed_password,
        company_name,
        remember_me
      })
      .pipe(
        tap((response) => {
          const token = response?.token || response?.access_token || response?.idToken;
          if (token) {
            localStorage.setItem('token', token);
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
    this.router.navigate(['/login']);

  }
}
