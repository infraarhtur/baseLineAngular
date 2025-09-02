import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = `${environment.apiUrl}api/category`; // URL del backend

  constructor(private http: HttpClient) { }

  /**
 * Obtiene la lista de clientes desde el backend
 */
  getAllCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // obtener una categoria por su ID
  getCategoryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // crear una categoria
  createCategory(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }
  // actualizar una categoria
  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }
// eliminar una categoria  por su ID
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

}
