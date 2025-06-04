import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { UpdateCategoriesComponent } from './components/update-categories/update-categories.component';
import { SelectCategoriesComponent } from './components/select-categories/select-categories.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { ReactiveFormsModule, } from '@angular/forms';


@NgModule({
  declarations: [
    UpdateCategoriesComponent,
    SelectCategoriesComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class CategoriesModule { }
