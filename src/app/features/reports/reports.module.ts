import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SaleReportByPeriodComponent } from './components/sale-report-by-period/sale-report-by-period.component';
import { HomeReportComponent } from './components/home-report/home-report.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { SelectReportsComponent } from './components/select-reports/select-reports.component';
import { ReportSaleByProductsComponent } from './components/report-sale-by-products/report-sale-by-products.component';


@NgModule({
  declarations: [
    SaleReportByPeriodComponent,
    HomeReportComponent,
    SelectReportsComponent,
    ReportSaleByProductsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ]
})
export class ReportsModule { }
