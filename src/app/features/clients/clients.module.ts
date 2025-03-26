import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientsRoutingModule } from './clients-routing.module';
import { SelectClientsComponent } from './components/select-clients/select-clients.component';
import { CreateClientsComponent } from './components/create-clients/create-clients.component';
import { UpdateClientsComponent } from './components/update-clients/update-clients.component';

import { MaterialModule } from '../../shared/material/material.module';
import { HomeClientsComponent } from './components/home-clients/home-clients.component';
import { ClientFormComponent } from './components/client-form/client-form.component';


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
    MaterialModule
  ],
  exports: [

  ]
})
export class ClientsModule { }
