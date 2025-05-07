import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { SelectProvidersComponent } from './components/select-providers/select-providers.component';
import { UpdateProvidersComponent } from './components/update-providers/update-providers.component';


@NgModule({
  declarations: [
    SelectProvidersComponent,
    UpdateProvidersComponent
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule
  ]
})
export class ProvidersModule { }
