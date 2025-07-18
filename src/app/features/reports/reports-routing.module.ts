import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeReportComponent } from './components/home-report/home-report.component';
import { SaleReportByPeriodComponent } from './components/sale-report-by-period/sale-report-by-period.component';
import { SelectReportsComponent } from './components/select-reports/select-reports.component';
import { ReportSaleByProductsComponent } from './components/report-sale-by-products/report-sale-by-products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeReportComponent,
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' }, // Redirección automática
      { path: 'report_summary', component: SaleReportByPeriodComponent },
      { path: 'report_sale_by_product', component: ReportSaleByProductsComponent },
      // { path: 'update/:id', component: UpdateProvidersComponent },
       { path: 'select', component: SelectReportsComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
