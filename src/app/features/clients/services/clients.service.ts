import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = `${environment.apiUrl}api/clients`; // URL del backend

  constructor(private http: HttpClient) { }


  /**
   * Obtiene la lista de clientes desde el backend
   */
  getClients(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Eliminar cliente por ID (UUID)
  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  //  Crear un nuevo cliente
  createClient(clientData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, clientData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  updateClient(id: string, clientData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, clientData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
