import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio de autenticación que maneja el login, logout, validación de tokens,
 * refresh de tokens y permisos de usuario.
 * Proporciona métodos para interactuar con el backend de autenticación.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authBaseUrl = `${environment.apiUrlAuth}`;
  private baseUrl = `${environment.apiUrl}`;

  /**
   * Constructor del servicio de autenticación.
   * @param http Cliente HTTP de Angular para realizar peticiones HTTP.
   * @param router Router de Angular para navegar entre componentes.
   */
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Realiza el proceso de login del usuario.
   * Autentica al usuario con las credenciales proporcionadas y almacena los tokens
   * (access token y refresh token) en localStorage. Redirige al usuario a la página
   * home si el login es exitoso.
   * @param email Email del usuario.
   * @param password Contraseña del usuario.
   * @param company_name Nombre de la compañía.
   * @param remember_me Indica si se debe recordar la sesión del usuario.
   * @returns Observable que emite true si el login es exitoso.
   */
  login(email: string, password: string, company_name: string, remember_me: boolean): Observable<boolean> {
    const url = `${this.authBaseUrl}auth/login`;
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

  /**
   * Verifica si el usuario está autenticado.
   * Comprueba si existe un token válido y que no haya expirado.
   * @returns true si el usuario está autenticado, false en caso contrario.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Obtiene el access token almacenado en localStorage.
   * @returns El access token como string, o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtiene el refresh token almacenado en localStorage.
   * @returns El refresh token como string, o null si no existe.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Almacena el refresh token en localStorage.
   * @param refreshToken El refresh token a almacenar.
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Elimina el refresh token de localStorage.
   */
  removeRefreshToken(): void {
    localStorage.removeItem('refresh_token');
  }

  /**
   * Verifica si el refresh token ha expirado.
   * @param refreshToken Opcional. El refresh token a verificar. Si no se proporciona,
   * se obtiene automáticamente de localStorage.
   * @returns true si el token ha expirado o no existe, false si aún es válido.
   */
  isRefreshTokenExpired(refreshToken?: string | null): boolean {
    const token = refreshToken ?? this.getRefreshToken();
    if (!token) return true;
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= payload.exp;
  }

  /**
   * Verifica si el token expirará pronto dentro del tiempo especificado.
   * @param token Opcional. El token a verificar. Si no se proporciona, se obtiene automáticamente.
   * @param minutesBeforeExpiry Número de minutos antes de la expiración para considerar "pronto". Por defecto 5 minutos.
   * @returns true si el token expirará dentro del tiempo especificado, false en caso contrario.
   */
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

  /**
   * Calcula el tiempo restante hasta que expire el token, en segundos.
   * @param token Opcional. El token a verificar. Si no se proporciona, se obtiene automáticamente.
   * @returns El número de segundos hasta la expiración, o 0 si ya expiró o es inválido.
   */
  getTokenTimeUntilExpiry(token?: string | null): number {
    const t = token ?? this.getToken();
    if (!t) return 0;
    const payload = this.decodeToken(t);
    if (!payload || !payload.exp) return 0;
    const nowSec = Math.floor(Date.now() / 1000);
    const expiryTime = payload.exp;
    return Math.max(0, expiryTime - nowSec);
  }

  /**
   * Calcula el tiempo restante hasta que expire el token, en minutos.
   * @param token Opcional. El token a verificar. Si no se proporciona, se obtiene automáticamente.
   * @returns El número de minutos hasta la expiración.
   */
  getTokenMinutesUntilExpiry(token?: string | null): number {
    const secondsUntilExpiry = this.getTokenTimeUntilExpiry(token);
    return Math.floor(secondsUntilExpiry / 60);
  }

  /**
   * Determina si el token debería ser refrescado.
   * Un token debería refrescarse si está pronto a expirar pero aún no ha expirado.
   * @param token Opcional. El token a verificar. Si no se proporciona, se obtiene automáticamente.
   * @param minutesBeforeExpiry Número de minutos antes de la expiración para considerar refrescar. Por defecto 5 minutos.
   * @returns true si el token debería ser refrescado, false en caso contrario.
   */
  shouldRefreshToken(token?: string | null, minutesBeforeExpiry: number = 5): boolean {
    return this.isTokenExpiringSoon(token, minutesBeforeExpiry) && !this.isTokenExpired(token);
  }

  /**
   * Decodifica una cadena Base64URL a una cadena normal.
   * Base64URL es una variante de Base64 usada en tokens JWT.
   * @param input La cadena Base64URL a decodificar.
   * @returns La cadena decodificada.
   */
  private base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    return atob(base64 + pad);
  }

  /**
   * Decodifica un token JWT y extrae su payload (cuerpo).
   * Un token JWT está compuesto por tres partes separadas por puntos: header.payload.signature.
   * Este método extrae y decodifica la parte del payload.
   * @param token El token JWT a decodificar.
   * @returns El payload del token decodificado, o null si el token es inválido.
   */
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

  /**
   * Obtiene el payload del token actual almacenado.
   * El payload contiene información como email, name, company_id, permisos, etc.
   * @returns El payload del token actual, o null si no hay token o es inválido.
   */
  getTokenPayload(): any | null {

    const token = this.getToken();
    return token ? this.decodeToken(token) : null;


  }

  /**
   * Verifica si el token ha expirado.
   * @param token Opcional. El token a verificar. Si no se proporciona, se obtiene automáticamente.
   * @returns true si el token ha expirado o no existe, false si aún es válido.
   */
  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    const payload = this.decodeToken(t);
    if (!payload || !payload.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return nowSec >= payload.exp;
  }

  /**
   * Obtiene el email y el nombre del usuario autenticado desde el token.
   * @returns Un objeto con las propiedades email y name, o null si no están disponibles.
   */
  getUserName():  any | null {
    const payload = this.getTokenPayload();

    const email = payload['email'];
    const name = payload['name'];

    if (payload && payload['email']) {
      return {email, name};
    }
    return null;
  }

  /**
   * Obtiene el ID de la compañía del usuario autenticado desde el token.
   * @returns El ID de la compañía como string, o null si no está disponible.
   */
  getUserCompany_id(): string | null {
    const payload = this.getTokenPayload();
    if (payload && payload['company_id']) {
      return payload['company_id'];
    }
    return null;
  }

  /**
   * Obtiene el nombre de la compañía del usuario autenticado desde el token.
   * @returns El nombre de la compañía como string, o null si no está disponible.
   */
  getUserCompanyName(): string | null {
    const payload = this.getTokenPayload();
    if (payload && payload['company_name']) {
      return payload['company_name'];
    }
    return null;
  }

  /**
   * Realiza el logout del usuario.
   * Elimina los tokens de localStorage y redirige al usuario a la página de login.
   */
  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  /**
   * Realiza un logout forzado con redirección absoluta.
   * Similar a logout() pero utiliza window.location.href en lugar del Router.
   * Útil cuando se necesita forzar una recarga completa de la página.
   */
  logoutForceRedirect() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
   window.location.href = '/login';
  }

  /**
   * Solicita un restablecimiento de contraseña.
   * Envía un correo electrónico al usuario con un token para restablecer su contraseña.
   * @param email Email del usuario que solicita el restablecimiento.
   * @param company_name Nombre de la compañía del usuario.
   * @returns Observable con la respuesta del servidor.
   */
  resetPassword(email: string, company_name: string): Observable<any> {
    const url = `${this.authBaseUrl}auth/password-reset`;
    return this.http.post<any>(url, { email, company_name  });
  }

  /**
   * Valida un token de restablecimiento de contraseña.
   * Verifica si el token proporcionado es válido y no ha expirado.
   * @param token El token de restablecimiento de contraseña a validar.
   * @returns Observable con la respuesta del servidor indicando si el token es válido.
   */
  validateToken(token: string): Observable<any> {
     const url = `${this.authBaseUrl}auth/password-reset/validate`;
    return this.http.get<any>(url, { params: { token } });
  }

  /**
   * Confirma el restablecimiento de contraseña con un nuevo password.
   * Actualiza la contraseña del usuario usando el token de restablecimiento.
   * @param token El token de restablecimiento de contraseña.
   * @param new_password La nueva contraseña del usuario.
   * @returns Observable con la respuesta del servidor.
   */
  resetPasswordConfirm(token: string, new_password: string): Observable<any> {
    const url = `${this.authBaseUrl}auth/password-reset/confirm`;
    return this.http.post<any>(url, { token, new_password });
  }

  /**
   * Refresca el access token usando el refresh token.
   * Obtiene un nuevo access token (y opcionalmente un nuevo refresh token) del servidor.
   * Actualiza automáticamente los tokens en localStorage.
   * @throws Error si no hay refresh token disponible o si ha expirado.
   * @returns Observable con los nuevos tokens (access_token y opcionalmente refresh_token).
   */
  refreshToken(): Observable<{ access_token: string; refresh_token?: string }> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (this.isRefreshTokenExpired(refreshToken)) {
      throw new Error('Refresh token has expired');
    }

    const url = `${this.authBaseUrl}auth/refresh`;

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

  /**
   * Solicita la verificación de email del usuario.
   * Envía un correo electrónico al usuario con un link para verificar su email.
   * @param email Email del usuario a verificar.
   * @returns Observable con la respuesta del servidor.
   */
  emailVerified(email: string): Observable<any> {
    const url = `${this.authBaseUrl}auth/email-verification`;
    return this.http.post<any>(url, { email });
  }

  /**
   * Confirma la verificación de email usando el token proporcionado.
   * Verifica el email del usuario al hacer clic en el link enviado por correo.
   * @param token El token de verificación de email.
   * @returns Observable con la respuesta del servidor.
   */
  emailVerifiedConfirm(token: string): Observable<any> {
    const url = `${this.authBaseUrl}auth/email-verification/confirm`;
    return this.http.post<any>(url, { token });
  }

  /**
   * Verifica si el usuario autenticado tiene un permiso específico.
   * El permiso se verifica contra el array de permisos almacenado en el payload del token.
   * @param permission El permiso a verificar (ej: 'create_user', 'edit_product', etc.).
   * @returns true si el usuario tiene el permiso, false en caso contrario.
   */
  hasPermission(permission: string): boolean {
    const payload = this.getTokenPayload();

    return payload && payload['permissions'] && payload['permissions'].includes(permission);
  }
}
