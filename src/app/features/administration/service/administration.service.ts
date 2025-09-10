import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  private authBaseUrl = `${environment.apiUrlAuth}`;
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private router: Router) { }

  getUsersByCompany(company_id: string): Observable<any> {
    return this.http.get<any>(`${this.authBaseUrl}companies/${company_id}/users`);
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.authBaseUrl}/api/roles`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.authBaseUrl}/api/users/${id}`);
  }


}
