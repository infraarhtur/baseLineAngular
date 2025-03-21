import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SelectClientsComponent } from './components/select-clients/select-clients.component';
import { CreateClientsComponent } from './components/create-clients/create-clients.component';
import { UpdateClientsComponent } from './components/update-clients/update-clients.component';

const routes: Routes = [
  {
    path: '',
    component: SelectClientsComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' }, // Redirección automática
      { path: 'create', component: CreateClientsComponent },
      { path: 'update', component: UpdateClientsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
