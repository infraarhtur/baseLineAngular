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
  ngOnInit(): void {
    // Load initial data or perform any setup needed for the component
  }
}
