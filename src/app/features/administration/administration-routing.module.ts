import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { SelectUserComponent } from './components/select-user/select-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { SelectRoleComponent } from './components/select-role/select-role.component';
import { RoleCheckBoxComponent } from './components/role-check-box/role-check-box.component';

const routes: Routes = [
  {
    path: '',
    component: HomeAdminComponent,
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' }, // Redirección automática
      { path: 'create-user', component: CreateUserComponent },
      { path: 'create-role', component: CreateRoleComponent },
      { path: 'select-user', component: SelectUserComponent },
      { path: 'select-role', component: SelectRoleComponent },
       { path: 'update-user/:id', component: UpdateUserComponent },
       { path: 'role-check-box', component: RoleCheckBoxComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
