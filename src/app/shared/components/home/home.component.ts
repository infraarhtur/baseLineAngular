import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../material/material.module';
import { ReportService } from '../../../features/reports/services/reports.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserSignalService } from '../../services/user-signal.service';
import { AuthService } from '../../../services/auth.service';
import { ClientsService } from '../../../features/clients/services/clients.service';
import { ProductsService } from '../../../features/products/services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, SharedModule, MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  cards: any[] = [];
  clientsByPurchases: any[] = [];
  productsLowStock: any[] = [];
  //variables del reporte de ventas por periodo
  public salesData: any[] = [];
  public salesDataTotal: any;
  public dataSourcePeriod = new MatTableDataSource<any>();


  // --- Gráfico de dona ---
  public dataDoughnut: any[] = [];
  public doughnutChartData!: ChartConfiguration<'doughnut'>['data'];
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'left', labels: { color: '#333', font: { size: 14 } } },
      title: {
        display: true,
        text: 'Unidades Vendidas por Producto'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const item = this.dataSourcePeriod.data[index];
            const units = item.total_sales;
            const total_amount = item.total_amount;
            const discount = item.total_discount;
            return [
              `Total de ventas: ${units.toLocaleString('es-CO')}`,
              `Monto de ventas: $${total_amount.toLocaleString('es-CO')}`,
              `Descuento total: $${discount.toLocaleString('es-CO')}`
            ];
          }
        }
      }
    }
  };


  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // --- Gráfico de barras  top 5 productos---
  top5Products: any[] = [];
  @ViewChild('chartBarTop5') chartBarTop5?: BaseChartDirective;
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#333', font: { size: 14 } }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#333'
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        ticks: {
          color: '#333'
        },
        grid: {
          display: false
        }
      }
    }
  };



  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private userSignalService: UserSignalService,
    private authService: AuthService,
    private clientsService: ClientsService,
    private productsService: ProductsService) {

  }
  ngOnInit(): void {
    // Load initial data or perform any setup needed for the component
  }
  ngAfterViewInit(): void {
    // Los signals ya están actualizados en AppComponent.loadInfo() antes del render
    // No es necesario actualizarlos aquí

    setTimeout(() => {
      this.loadReportData('2025-08-01', '2025-12-15');
      this.loadTop5Products('2025-08-01', '2025-12-15');
      this.loadTop3ClientsByPurchases();
      this.loadProductsLowStock();
    }, 500);
  }


  loadReportData(start_date: string, end_date: string): void {
    console.log(start_date, end_date);
    // Logic to load report data, e.g., calling a service method
    this.reportService.report_sale_summary_payment(start_date, end_date).subscribe({
      next: (data) => {
        const translatedData = this.translatePaymentMethods(data);
        this.dataSourcePeriod.data = translatedData;
        this.dataDoughnut = translatedData.filter(item => item.payment_method_label !== 'Total General');
        this.salesDataTotal = translatedData[translatedData.length - 1];
        //this.updateChartData(translatedData);
        this.loadCardsReporPeriodData();
        this.loadDoughnutChart();
        this.loadReportDataByStatusPending('2025-08-01', '2025-12-15', 'pending');
        this.snackbar.success('Ventas cargados');
      },
      error: (err) => {
        this.snackbar.error('Error al obtener ventas por periodo');
        console.error('Error al obtener ventas por periodo', err);
      }
    });
  }

  loadReportDataByStatusPending(start_date: string, end_date: string, status: string): void {
    this.reportService.report_sale_summary_payment(start_date, end_date, status).subscribe({
      next: (data) => {
        this.logicCardPending(data);
        this.snackbar.success('Ventas pendientes cargados');
      },
      error: (err) => {
        this.snackbar.error('Error al obtener ventas pendientes por periodo');
        console.error('Error al obtener ventas pendientes por periodo', err);
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
      {
        title: 'Total vendido',
        amount: this.salesDataTotal.total_amount
        , color: 'green', icon: 'attach_money', icon2: 'sell_outline', info: `Descuento Total $ ${this.salesDataTotal.total_discount.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      },
      {
        title: '# Compras totales pagas',
        amount: this.salesDataTotal.total_sales,
        color: 'purple', icon: 'receipt_long', icon2: 'receipt_long', info: `# Compras totales pagas`
      },];

  }
  loadDoughnutChart(): void {
    const labels = this.dataDoughnut.map(item => item.payment_method_label);
    const units = this.dataDoughnut.map(item => item.total_amount);

    // Paleta de colores por defecto de Chart.js
    const defaultColors = [
      'rgba(54, 162, 235, 0.8)',  // Azul
      'rgba(255, 99, 132, 0.8)',  // Rojo/Rosa
      'rgba(255, 206, 86, 0.8)',  // Amarillo
      'rgba(75, 192, 192, 0.8)',  // Turquesa
      'rgba(153, 102, 255, 0.8)', // Púrpura
      'rgba(255, 159, 64, 0.8)',  // Naranja
      'rgba(199, 199, 199, 0.8)', // Gris
      'rgba(83, 102, 255, 0.8)',  // Azul índigo
      'rgba(255, 99, 255, 0.8)',  // Magenta
      'rgba(99, 255, 132, 0.8)',  // Verde
    ];

    const backgroundColors = units.map((_, index) =>
      defaultColors[index % defaultColors.length]
    );

    this.doughnutChartData = {
      labels,
      datasets: [
        {
          data: units,
          backgroundColor: backgroundColors,
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    };

    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'left' },
        title: {
          display: false,
          text: 'Metodo de pago de ventas'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              const item = this.dataSourcePeriod.data[index];
              return [
                `Metodo de pago: ${item.payment_method_label}`,
                ` # de ventas: ${item.total_sales}`,
                `Monto de ventas: $${item.total_amount.toLocaleString('es-CO')}`,
                `Descuento: $${item.total_discount.toLocaleString('es-CO')}`
              ];
            }
          }
        }
      }
    };
    this.chart?.update();
  }
  logicCardPending(data: any[]): void {
    const translatedData = this.translatePaymentMethods(data);
    let total_sales_pending = translatedData[translatedData.length - 1].total_sales + 1;
    let total_amount_pending = translatedData[translatedData.length - 1].total_amount;
    let total_discount_pending = translatedData[translatedData.length - 1].total_discount;


    let objCard_total_sales_pending = {
      title: ' # Compras totales sin pagar',
      amount: total_sales_pending, color: 'red', icon: 'receipt_long', icon2: 'receipt_long', info: `# Compras totales sin pagar`
    }


    let objCard_total_amount_pending = {
      title: ' Monto total sin pagar',
      amount: total_amount_pending, color: 'red', icon: 'attach_money', icon2: 'sell_outline', info: `Monto decuento $
            ${total_discount_pending.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }

    this.cards.push(objCard_total_amount_pending);
    this.cards.push(objCard_total_sales_pending);
  }

  loadTop5Products(start_date: string, end_date: string): void {
    this.reportService.report_sale_by_products(start_date, end_date, 'paid').subscribe({
      next: (data: any[]) => {

        const sortedData = [...data].sort((a, b) => b.total_units_sold - a.total_units_sold);
        this.top5Products = sortedData.slice(0, 5);

        // Actualizar el gráfico después de cargar los datos
        this.updateBarChartTop5Products();

      },
      error: (err) => {
        this.snackbar.error('Error al obtener top 5 productos mas vendidos');
        console.error('Error al obtener top 5 productos mas vendidos', err);
      }
    });
  }
  updateBarChartTop5Products(): void {
    const labels = this.top5Products.map(item => item.product_name);
    const data = this.top5Products.map(item => item.total_units_sold);

    // Paleta de colores para el gráfico de barras
    const barColors = [
      'rgba(54, 162, 235, 0.8)',  // Azul
      'rgba(255, 99, 132, 0.8)',  // Rojo/Rosa
      'rgba(255, 206, 86, 0.8)',  // Amarillo
      'rgba(75, 192, 192, 0.8)',  // Turquesa
      'rgba(153, 102, 255, 0.8)', // Púrpura
    ];

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Unidades vendidas',
          backgroundColor: barColors.slice(0, labels.length),
          borderColor: barColors.map(color => color.replace('0.8', '1')),
          borderWidth: 2
        }
      ]
    };
    this.chartBarTop5?.update();
  }

  // Obtener top 3 clientes por compras
  loadTop3ClientsByPurchases(): void {
    this.clientsService.top_3_clients_by_purchases.subscribe({
      next: (data) => {
        this.clientsByPurchases = data;

      },
      error: (err) => {
        this.snackbar.error('Error al obtener top 3 clientes por compras');
        console.error('Error al obtener top 3 clientes por compras', err);
      }
    });
  }
// Obtener productos con stock bajo

  loadProductsLowStock(): void {
    this.productsService.getProductsLowStock().subscribe({
      next: (data) => {
        this.productsLowStock = [...data].sort((a, b) => a.stock - b.stock);
        this.productsLowStock = this.productsLowStock.slice(0, 3);
      },
      error: (err) => {
        console.error('Error al obtener productos con stock bajo', err);
      }
    });
  }
}
