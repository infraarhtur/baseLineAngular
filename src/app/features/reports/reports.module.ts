import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
import { SaleReportByPeriodComponent } from './components/sale-report-by-period/sale-report-by-period.component';
import { HomeReportComponent } from './components/home-report/home-report.component';
import { SelectReportsComponent } from './components/select-reports/select-reports.component';
import { ReportSaleByProductsComponent } from './components/report-sale-by-products/report-sale-by-products.component';
import { MaterialModule } from '../../shared/material/material.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    HomeReportComponent,
    SelectReportsComponent,
    ReportSaleByProductsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    SaleReportByPeriodComponent
  ]
})
export class ReportsModule { }
