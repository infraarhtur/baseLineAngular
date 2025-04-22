import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectProductsComponent } from './components/select-products/select-products.component';
import { CreateProductsComponent } from './components/create-products/create-products.component';
import { UpdateProductsComponent } from './components/update-products/update-products.component';
import { HomeProductsComponent } from './components/home-products/home-products.component';
const routes: Routes = [
  {
    path: '',
    component: HomeProductsComponent,
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' }, // Redirección automática
      { path: 'create', component: CreateProductsComponent },
      { path: 'update/:id', component: UpdateProductsComponent },
      { path: 'select', component: SelectProductsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
