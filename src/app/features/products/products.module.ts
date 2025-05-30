import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing.module';
import { CreateProductsComponent } from './components/create-products/create-products.component';
import { SelectProductsComponent } from './components/select-products/select-products.component';
import { UpdateProductsComponent } from './components/update-products/update-products.component';
import { MaterialModule } from '../../shared/material/material.module';
import { HomeProductsComponent } from './components/home-products/home-products.component';
import { FormProductsComponent } from './components/form-products/form-products.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreateProductsComponent,
    SelectProductsComponent,
    UpdateProductsComponent,
    HomeProductsComponent,
    FormProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    SelectProductsComponent
  ]
})
export class ProductsModule { }
