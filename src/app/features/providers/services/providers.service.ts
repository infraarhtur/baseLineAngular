import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private baseUrl = `${environment.apiUrl}api/provider`; // URL del backend

  constructor(private http: HttpClient) { }

  getAllProviders(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Obtener un providero por su ID
  getProviderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Crear un providero
  createProvider(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  // Actualizar un providero
  updateProvider(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar un providero
  deleteProvider(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

}
