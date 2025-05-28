import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSalesComponent } from './components/home-sales/home-sales.component';
import { CreateSalesComponent } from './components/create-sales/create-sales.component';
import { UpdateSalesComponent } from './components/update-sales/update-sales.component';
import { SelectSalesComponent } from './components/select-sales/select-sales.component';


const routes: Routes = [
  {
    path: '',
    component: HomeSalesComponent,
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' }, // Redirección automática
      { path: 'create', component: CreateSalesComponent },
      { path: 'update/:id', component: UpdateSalesComponent },
      { path: 'select', component: SelectSalesComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
