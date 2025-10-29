import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public salesData: any[] = [];

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
      tooltip: { mode: 'index', intersect: false }
    }
  };

  public barChartType: 'bar' = 'bar';

  ngOnInit(): void {
    this.salesData = this.getSalesData();
    this.updateChartData();
  }

  // Simulación de datos (como si vinieran del backend)
  getSalesData(): any[] {
    return [
      {
        payment_method_label: 'Efectivo',
        total_sales: 7,
        total_amount: 800500,
        total_discount: 64000
      },
      {
        payment_method_label: 'Tarjeta de crédito',
        total_sales: 1,
        total_amount: 150000,
        total_discount: 0
      },
      {
        payment_method_label: 'other',
        total_sales: 1,
        total_amount: 4050,
        total_discount: 450
      }
    ];
  }

  // Construye los datos para el gráfico
  updateChartData(): void {
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
  }
}
