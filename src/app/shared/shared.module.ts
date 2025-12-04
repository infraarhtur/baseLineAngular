import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { DateRangeFilterComponent } from './components/date-range-filter/date-range-filter.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';





@NgModule({
  declarations: [HasPermissionDirective, DateRangeFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  exports: [HasPermissionDirective, DateRangeFilterComponent]
})
export class SharedModule { }
