import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = `${environment.apiUrl}api/sale`; // URL del backend

  constructor(private http: HttpClient) { }

   /**
   * Obtiene la lista las ventas desde el backend
   */
  getSales(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  // trae una venta por ID (UUID)
  getSaletById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  //  Crear una nueva venta
  createSale(saleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, saleData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  //  Editar una  venta
  updateSale(id: string, saleData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, saleData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
  // Anular una venta
  deleteSale(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }


}
