import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../material/material.module';
import { ReportService } from '../../../features/reports/services/reports.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective,SharedModule,MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  cards = [
    { title: 'unidades vendidas', amount: 62076, color: 'green', icon: 'table_chart', progress: '48%' },
    { title: 'total vendido', amount: 1958104, color: 'red', icon: 'attach_money', progress: '55%' },
    { title: 'Lead Conversion', amount: 234769, color: 'purple', icon: 'show_chart', progress: '87%' },
    { title: 'Average Income', amount: 1200, color: 'blue', icon: 'credit_card', progress: '48%' },
  ];
   // --- Gráfico de barras ---
   barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      { data: [90, 95, 100, 95, 85, 110], label: 'Ample', backgroundColor: '#42A5F5' },
      { data: [70, 75, 80, 70, 65, 78], label: 'Pixel', backgroundColor: '#26C6DA' }
    ]
  };

  // --- Gráfico de dona ---
  doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  };

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ['#42A5F5', '#7E57C2', '#26C6DA'],
        hoverBackgroundColor: ['#64B5F6', '#9575CD', '#4DD0E1']
      }
    ]
  };
//variables del reporte de ventas por periodo
public salesData: any[] = [];
public salesDataTotal: any;
public dataSourcePeriod = new MatTableDataSource<any>();


  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private snackbar: SnackbarService) {

  }
  ngOnInit(): void {
    // Load initial data or perform any setup needed for the component

    this.loadReportData('2025-08-01', '2025-11-15');
  }


  loadReportData(start_date: string, end_date: string): void {
    console.log(start_date, end_date);
    // Logic to load report data, e.g., calling a service method
    this.reportService.report_sale_summary_payment(start_date, end_date).subscribe({
      next: (data) => {
        const translatedData = this.translatePaymentMethods(data);
        console.log(translatedData);
        this.dataSourcePeriod.data = translatedData;
        this.salesDataTotal = translatedData[translatedData.length - 1];
        //this.updateChartData(translatedData);
        this.loadCardsReporPeriodData();
        this.snackbar.success('Ventas cargados');
      },
      error: (err) => {
        this.snackbar.error('Error al obtener clientes');
        console.error('Error al obtener clientes', err);
      }
    });
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

  loadCardsReporPeriodData(): void {

    this.cards = [
      { title: 'Total vendido', amount: this.salesDataTotal.total_amount, color: 'green', icon: 'attach_money', progress: '48%' },
      { title: 'Descuento Total', amount:  this.salesDataTotal.total_discount, color: 'red', icon: 'attach_money', progress: '55%' },
      { title: '# Compras totales', amount: this.salesDataTotal.total_sales, color: 'purple', icon: 'receipt_long', progress: '87%' },

    ];

  }

}
