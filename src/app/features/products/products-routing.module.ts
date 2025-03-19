import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectProductsComponent } from './components/select-products/select-products.component';
import { CreateProductsComponent } from './components/create-products/create-products.component';
import { UpdateProductsComponent } from './components/update-products/update-products.component';

const routes: Routes = [
  {
    path: '',
    component: SelectProductsComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' }, // Redirección automática
      { path: 'create', component: CreateProductsComponent },
      { path: 'update', component: UpdateProductsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
