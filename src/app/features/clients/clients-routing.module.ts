import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SelectClientsComponent } from './components/select-clients/select-clients.component';
import { CreateClientsComponent } from './components/create-clients/create-clients.component';
import { UpdateClientsComponent } from './components/update-clients/update-clients.component';
import { HomeClientsComponent } from './components/home-clients/home-clients.component';

const routes: Routes = [
  {
    path: '',
    component: HomeClientsComponent,
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' }, // Redirección automática
      { path: 'create', component: CreateClientsComponent },
      { path: 'update/:id', component: UpdateClientsComponent },
      { path: 'select', component: SelectClientsComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
