import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { ClientsRoutingModule } from './clients-routing.module';
import { SelectClientsComponent } from './components/select-clients/select-clients.component';
import { CreateClientsComponent } from './components/create-clients/create-clients.component';
import { UpdateClientsComponent } from './components/update-clients/update-clients.component';

import { MaterialModule } from '../../shared/material/material.module';
import { HomeClientsComponent } from './components/home-clients/home-clients.component';
import { ClientFormComponent } from './components/client-form/client-form.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    SelectClientsComponent,
    CreateClientsComponent,
    UpdateClientsComponent,
    HomeClientsComponent,
    ClientFormComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule

  ],
  exports: [
    SelectClientsComponent
  ]
})
export class ClientsModule { }
