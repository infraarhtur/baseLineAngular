import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { FormSalesComponent } from './components/form-sales/form-sales.component';
import { HomeSalesComponent } from './components/home-sales/home-sales.component';
import { CreateSalesComponent } from './components/create-sales/create-sales.component';
import { SelectSalesComponent } from './components/select-sales/select-sales.component';
import { UpdateSalesComponent } from './components/update-sales/update-sales.component';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { DetailSalesComponent } from './components/detail-sales/detail-sales.component';
import { ProductsModule } from '../products/products.module';
import { ClientsModule } from '../clients/clients.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    FormSalesComponent,
    HomeSalesComponent,
    CreateSalesComponent,
    SelectSalesComponent,
    UpdateSalesComponent,
    DetailSalesComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    ProductsModule,
    ClientsModule,
    FormsModule,
    SharedModule
  ]
})
export class SalesModule { }
