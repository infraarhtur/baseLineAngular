import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { SelectProvidersComponent } from './components/select-providers/select-providers.component';
import { UpdateProvidersComponent } from './components/update-providers/update-providers.component';

import { HomeProvidersComponent } from './components/home-providers/home-providers.component';
import { CreateProvidersComponent } from './components/create-providers/create-providers.component';
import { FormProvidersComponent } from './components/form-providers/form-providers.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [
    SelectProvidersComponent,
    UpdateProvidersComponent,
    HomeProvidersComponent,
    CreateProvidersComponent,
    FormProvidersComponent
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ProvidersModule { }
