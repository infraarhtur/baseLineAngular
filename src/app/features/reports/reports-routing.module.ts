import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeReportComponent } from './components/home-report/home-report.component';
import { SaleReportByPeriodComponent } from './components/sale-report-by-period/sale-report-by-period.component';

const routes: Routes = [
  {
    path: '',
    component: HomeReportComponent,
    children: [
      { path: '', redirectTo: 'sale-report-by-period', pathMatch: 'full' }, // Redirección automática
      { path: 'sale-report-by-period', component: SaleReportByPeriodComponent },
      // { path: 'update/:id', component: UpdateProvidersComponent },
      // { path: 'select', component: SelectProvidersComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
