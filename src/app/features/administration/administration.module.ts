import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { SelectUserComponent } from './components/select-user/select-user.component';
import { SelectRoleComponent } from './components/select-role/select-role.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FromUserComponent } from './components/from-user/from-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';


@NgModule({
  declarations: [
    HomeAdminComponent,
    CreateUserComponent,
    CreateRoleComponent,
    SelectUserComponent,
    SelectRoleComponent,
    FromUserComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AdministrationModule { }
