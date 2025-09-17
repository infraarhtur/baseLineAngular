import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CompanyDto {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private baseUrl = `${environment.apiUrl}api/company`;
  private authBaseUrl = `${environment.apiUrlAuth}companies/`;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<CompanyDto[]> {
    return this.http.get<any>(this.authBaseUrl).pipe(
      map((response: any) => {
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.companies)
          ? response.companies
          : Array.isArray(response?.data)
          ? response.data
          : [];
        return (items as any[]).map((c: any) => ({ id: c.id ?? c.company_id ?? c.uuid, name: c.name ?? c.company_name ?? c.nombre }));
      })
    );
  }

  searchCompanies(search: string, limit: number = 10, skip: number = 0): Observable<CompanyDto[]> {
    const params = new HttpParams()
      .set('skip', String(skip))
      .set('limit', String(limit))
      .set('search', search ?? '');

    return this.http.get<any>(this.authBaseUrl, { params }).pipe(
      map((response: any) => {
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response?.companies)
          ? response.companies
          : Array.isArray(response?.data)
          ? response.data
          : [];
        return (items as any[]).map((c: any) => ({ id: c.id ?? c.company_id ?? c.uuid, name: c.name ?? c.company_name ?? c.nombre }));
      })
    );
  }
}


