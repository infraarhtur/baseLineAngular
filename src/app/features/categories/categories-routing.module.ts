import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCategoriesComponent } from './components/home-categories/home-categories.component';
import { SelectCategoriesComponent } from './components/select-categories/select-categories.component';
import { UpdateCategoriesComponent } from './components/update-categories/update-categories.component';
import { CreateCategoriesComponent } from './components/create-categories/create-categories.component';

const routes: Routes = [

    {
      path: '',
      component: HomeCategoriesComponent,
      children: [
        { path: '', redirectTo: 'select', pathMatch: 'full' }, // Redirección automática
        { path: 'create', component: CreateCategoriesComponent },
        { path: 'update/:id', component: UpdateCategoriesComponent },
        { path: 'select', component: SelectCategoriesComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
