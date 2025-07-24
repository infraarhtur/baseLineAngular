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
  selector: 'app-report-sale-by-products',
  standalone: false,
  templateUrl: './report-sale-by-products.component.html',
  styleUrl: './report-sale-by-products.component.scss'
})
export class ReportSaleByProductsComponent implements OnInit, AfterViewInit {

  // Define the columns to be displayed in the table
  displayedColumns: string[] = ['product_name',
    'total_units_sold',
    'purchase_price',
    'sale_price',
    'total_revenue',
    'total_discount'];
  dataSource = new MatTableDataSource<any>();
  dataSourcePending = new MatTableDataSource<any>();
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


  loadReportData(start_date: string, end_date: string, status: string): void {
    // Logic to load report data, e.g., calling a service method
    this.reportService.report_sale_by_products(start_date,end_date, status).subscribe({
     next: (data) => {
      if(status === 'paid'){
        this.dataSource.data = data;
      }else{
        this.dataSourcePending.data = data;
      }
        console.log('Datos de ventas cargados:', data);
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
      this.loadReportData(start_date, end_date,'paid');
      this.loadReportData(start_date, end_date,'pending');
    } else {
      this.snackbar.error('Por favor, seleccione un rango de fechas válido.');
    }
  }
}
