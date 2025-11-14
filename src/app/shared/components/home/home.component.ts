import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective,SharedModule,MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  cards = [
    { title: 'Borrowed', amount: 62076, color: 'green', icon: 'table_chart', progress: '48%' },
    { title: 'Annual Profit', amount: 1958104, color: 'red', icon: 'attach_money', progress: '55%' },
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
  ngOnInit(): void {
    // Load initial data or perform any setup needed for the component
  }
}
