import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private apiUrl = `${environment.apiUrl}api/provider`; // URL del backend

  constructor(private http: HttpClient) { }

  getAllProviders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
