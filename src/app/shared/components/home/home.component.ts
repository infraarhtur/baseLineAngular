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




  ngOnInit(): void {
    this.salesData = this.getSalesData();

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

}
