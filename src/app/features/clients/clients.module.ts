import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientsRoutingModule } from './clients-routing.module';
import { SelectClientsComponent } from './components/select-clients/select-clients.component';
import { CreateClientsComponent } from './components/create-clients/create-clients.component';
import { UpdateClientsComponent } from './components/update-clients/update-clients.component';

import { MaterialModule } from '../../shared/material/material.module';


@NgModule({
  declarations: [
    SelectClientsComponent,
    CreateClientsComponent,
    UpdateClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CreateClientsComponent
  ]
})
export class ClientsModule { }
