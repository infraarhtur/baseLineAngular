import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductsRoutingModule } from './products-routing.module';
import { CreateProductsComponent } from './components/create-products/create-products.component';
import { SelectProductsComponent } from './components/select-products/select-products.component';
import { UpdateProductsComponent } from './components/update-products/update-products.component';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [
    CreateProductsComponent,
    SelectProductsComponent,
    UpdateProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    RouterModule,
    MaterialModule
  ]
})
export class ProductsModule { }
