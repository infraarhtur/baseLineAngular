import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = 'http://localhost:8001/api/clients'; // URL del backend

  constructor(private http: HttpClient) {}


  /**
   * Obtiene la lista de clientes desde el backend
   */
  getClients(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
