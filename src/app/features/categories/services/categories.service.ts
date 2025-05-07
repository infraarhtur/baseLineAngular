import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}api/category`; // URL del backend

  constructor(private http: HttpClient) { }

    /**
   * Obtiene la lista de clientes desde el backend
   */
    getAllCategories(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }
}
