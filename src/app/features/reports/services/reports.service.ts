import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}api/report`; // URL del backend
  constructor(private http: HttpClient) { }

  /**
   * Obtiene resumen de ventas por periodo y metodo de pago
   * @param start_date Fecha de inicio del periodo
   * @param end_date Fecha de fin del periodo
   * @returns Observable con el resumen de ventas
   * Esta función realiza una solicitud GET al backend para obtener un resumen de ventas por periodo y
   */
  report_sale_summary_payment(start_date: string, end_date: string): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/report_sale_summary_payment`, {
      params: {
        start_date,
        end_date
      }
    });
  }

  report_sale_by_products(start_date: string, end_date: string, status: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report_sales_by_products`, {
      params: {
        start_date,
        end_date,
        status
      }
    });
  }
}
