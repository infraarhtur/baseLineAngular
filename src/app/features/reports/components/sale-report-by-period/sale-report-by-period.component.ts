import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReportService } from '../../services/reports.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-sale-report-by-period',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, RouterModule, MaterialModule, BaseChartDirective, CurrencyPipe],
  templateUrl: './sale-report-by-period.component.html',
  styleUrl: './sale-report-by-period.component.scss'
})
export class SaleReportByPeriodComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  displayedColumns: string[] = ['payment_method_label', 'total_sales', 'total_amount', 'total_discount'];
  dataSource = new MatTableDataSource<any>();
  // paginacion
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // filters
  startDate: Date | null = null;
  endDate: Date | null = null;
  public salesData: any[] = [];
  public salesDataTotal: any;

  // Datos del gráfico (se asignan dinámicamente)
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { stepSize: 100000 }
      }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false },

    }
  };

  public barChartType: 'bar' = 'bar';

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
    this.reportService.report_sale_summary_payment(start_date, end_date).subscribe({
      next: (data) => {
        const translatedData = this.translatePaymentMethods(data);
        this.dataSource.data = translatedData;
        this.salesDataTotal = translatedData[translatedData.length - 1];
        this.updateChartData(translatedData);
        console.log(translatedData);
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


  // Construye los datos para el gráfico
  updateChartData(data: any[]): void {
    this.salesData = data.filter(item => item.payment_method_label !== 'Total General');

    if (this.salesData && this.salesData.length > 0) {
      this.barChartData = {
        labels: this.salesData.map(item => item.payment_method_label),
        datasets: [
          {
            label: 'Ventas Totales',
            data: this.salesData.map(item => item.total_sales),
            backgroundColor: '#1e40af'
          },
          {
            label: 'Monto Total ($)',
            data: this.salesData.map(item => item.total_amount),
            backgroundColor: '#ea580c'
          },
          {
            label: 'Descuento Total ($)',
            data: this.salesData.map(item => item.total_discount),
            backgroundColor: '#0891b2'
          }
        ]
      };
      setTimeout(() => {
        // 🔹 Fuerza redibujo
        this.chart?.update();
      }, 5000);
    }
  }

}