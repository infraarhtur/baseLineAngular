import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSignalService {
  // Signal para el nombre de usuario
  private _userName = signal<string | null>(null);
  
  // Readonly signal para acceso desde componentes
  public readonly userName = this._userName.asReadonly();

  // Signal para el nombre de la compañía
  private _userCompanyName = signal<string | null>(null);
  
  // Readonly signal para acceso desde componentes
  public readonly userCompanyName = this._userCompanyName.asReadonly();

  /**
   * Actualiza el nombre de usuario
   * @param name - El nombre del usuario a establecer
   */
  updateUserName(name: string | null): void {
    this._userName.set(name);
  }

  /**
   * Actualiza el nombre de la compañía
   * @param companyName - El nombre de la compañía a establecer
   */
  updateUserCompanyName(companyName: string | null): void {
    this._userCompanyName.set(companyName);
  }

  /**
   * Obtiene el valor actual del signal del nombre de usuario
   */
  getUserName(): string | null {
    return this._userName();
  }

  /**
   * Obtiene el valor actual del signal del nombre de la compañía
   */
  getUserCompanyName(): string | null {
    return this._userCompanyName();
  }
}

