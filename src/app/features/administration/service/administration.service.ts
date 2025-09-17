import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getRoles(company_id: string): Observable<any> {
let params = new HttpParams()
    .set('skip', 0)
    .set('limit', 100)
    .set('company_id', company_id);

    return this.http.get<any>(`${this.authBaseUrl}roles/`, { params });
  }

  getUserById(id: string): Observable<any> {
    const company_name= localStorage.getItem('selected_company_id');
    return this.http.get<any>(`${this.authBaseUrl}users/${id}/${company_name}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.authBaseUrl}users/`, userData);
  }
  updateUser(id: string, userData: any): Observable<any> {
    delete userData.password;
    delete  userData.company_id;
    return this.http.put<any>(`${this.authBaseUrl}users/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.authBaseUrl}users/${id}`);
  }
}
