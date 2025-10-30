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
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-report-sale-by-products',
  standalone: false,
  templateUrl: './report-sale-by-products.component.html',
  styleUrl: './report-sale-by-products.component.scss'
})
export class ReportSaleByProductsComponent implements OnInit, AfterViewInit {

  // ----- GRÁFICO DE DONA -----
  public dataPaid: any[] = [];
  public doughnutChartData!: ChartConfiguration<'doughnut'>['data'];
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#333', font: { size: 14 } } },
      title: {
        display: true,
        text: 'Unidades Vendidas por Producto'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const item = this.dataPaid[index];
            const units = item.total_units_sold;
            const revenue = item.total_revenue;
            const discount = item.total_discount;
            const purchase = item.purchase_price;
            const sale = item.sale_price;

            return [
              `Unidades vendidas: ${units}`,
              `Precio compra: $${purchase.toLocaleString('es-CO')}`,
              `Precio venta: $${sale.toLocaleString('es-CO')}`,
              `Ingresos:  $${revenue.toLocaleString('es-CO')}`,
              `Descuento total: $${discount.toLocaleString('es-CO')}`
            ];
          }
        }
      }
    }
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
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
    this.reportService.report_sale_by_products(start_date, end_date, status).subscribe({
      next: (data) => {
        if (status === 'paid') {
          this.dataSource.data = data;

          this.dataPaid = data;
          this.loadDoughnutChart();
          console.log(this.dataSource.data);
        } else {
          this.dataSourcePending.data = data;

        }
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
      this.loadReportData(start_date, end_date, 'paid');
      this.loadReportData(start_date, end_date, 'pending');
    } else {
      this.snackbar.error('Por favor, seleccione un rango de fechas válido.');
    }
  }

  loadDoughnutChart(): void {
    const labels = this.dataPaid.map(item => item.product_name);
    const units = this.dataPaid.map(item => item.total_units_sold);

    // Normalizamos para generar intensidad de color según ventas
    const maxUnits = Math.max(...units);

    const backgroundColors = units.map(u => {
      const intensity = Math.round((u / maxUnits) * 255);
      // Azul base con intensidad variable
      // return `rgba(${255 - intensity}, ${150 + intensity / 2}, ${235 - intensity / 3}, 0.8)`;

      // Colores más vivos tipo neón
      //return `rgba(${150 + intensity / 2}, ${50 + intensity}, ${255 - intensity / 4}, 0.9)`;

      // Gradiente cálido y brillante
return `rgba(${255}, ${80 + intensity / 2}, ${100 + intensity / 3}, 0.9)`;
    });

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
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Unidades Vendidas por Producto'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              const item = this.dataPaid[index];
              return [
                `Producto: ${item.product_name}`,
                `Unidades vendidas: ${item.total_units_sold}`,
                `Precio compra: $${item.purchase_price.toLocaleString('es-CO')}`,
                `Precio venta: $${item.sale_price.toLocaleString('es-CO')}`,
                `Ingresos: $${item.total_revenue.toLocaleString('es-CO')}`,
                `Descuento: $${item.total_discount.toLocaleString('es-CO')}`
              ];
            }
          }
        }
      }
    };
    this.chart?.update();
  }
}
