import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from '../../services/reports.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale-report-by-period',
  standalone: false,
  templateUrl: './sale-report-by-period.component.html',
  styleUrl: './sale-report-by-period.component.scss'
})
export class SaleReportByPeriodComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['payment_method_label', 'total_sales', 'total_amount','total_discount'];
  dataSource = new MatTableDataSource<any>();
  // paginacion
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // filters
  startDate: Date | null = null;
  endDate: Date | null = null;
 constructor(
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) { }
  ngOnInit(): void {

    // Load initial data or perform any setup needed for the component

  }
  ngAfterViewInit(): void {
    // Implement any additional logic needed after the view initializes
  }


  loadReportData(start_date: string, end_date: string): void {
    // Logic to load report data, e.g., calling a service method
    this.reportService.report_sale_summary_payment(start_date,end_date).subscribe({
     next: (data) => {
        const translatedData = this.translatePaymentMethods(data);
        this.dataSource.data = translatedData;
        this.snackbar.success('Ventas cargados');
      },
      error: (err) => {
        this.snackbar.error('Error al obtener clientes');
        console.error('Error al obtener clientes', err);
      }
    });
  }

  applyDateFilter(): void {
    if (this.startDate && this.endDate) {
      const start_date = this.startDate.toISOString().split('T')[0];
      const end_date = this.endDate.toISOString().split('T')[0];
      this.loadReportData(start_date, end_date);
    } else {
      this.snackbar.error('Por favor, seleccione un rango de fechas válido.');
    }
  }

  private translatePaymentMethods(data: any[]): any[] {
  const translationMap: Record<string, string> = {
    bank_transfer: 'Transferencia bancaria',
    cash: 'Efectivo',
    credit_card: 'Tarjeta de crédito',
    'Grand Total': 'Total General'
  };

  return data.map(item => ({
    ...item,
    payment_method_label: translationMap[item.payment_method_label] || item.payment_method_label
  }));
}
}
