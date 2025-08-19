import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<CompanyDto[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response as CompanyDto[];
        }
        if (response && Array.isArray(response.items)) {
          return response.items as CompanyDto[];
        }
        return [] as CompanyDto[];
      })
    );
  }
}


