import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SelectProvidersComponent } from './components/select-providers/select-providers.component';
import { CreateProvidersComponent } from './components/create-providers/create-providers.component';
import { UpdateProvidersComponent } from './components/update-providers/update-providers.component';
import { HomeProvidersComponent } from './components/home-providers/home-providers.component';

const routes: Routes = [
  {
    path: '',
    component: HomeProvidersComponent,
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' }, // Redirección automática
      { path: 'create', component: CreateProvidersComponent },
      { path: 'update/:id', component: UpdateProvidersComponent },
      { path: 'select', component: SelectProvidersComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
