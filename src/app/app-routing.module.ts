import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './shared/components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule),canActivate: [AuthGuard]},
  { path: 'clients', loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule) ,canActivate: [AuthGuard]},
  { path: 'providers', loadChildren: () => import('./features/providers/providers.module').then(m => m.ProvidersModule) ,canActivate: [AuthGuard]},
  { path: 'sales', loadChildren: () => import('./features/sales/sales.module').then(m => m.SalesModule),canActivate: [AuthGuard]},
  { path: 'category', loadChildren: () => import('./features/categories/categories.module').then(m => m.CategoriesModule),canActivate: [AuthGuard]},
  { path: 'dashboard', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

