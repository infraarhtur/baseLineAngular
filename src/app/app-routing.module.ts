import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './shared/components/login/login.component';
import { PasswordResetComponent } from './shared/components/password-reset/password-reset.component';
import { TokenValidateComponent } from './shared/components/token-validate/token-validate.component';
import { PasswordResetConfirmComponent } from './shared/components/password-reset-confirm/password-reset-confirm.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { public: true } },
  { path: 'token-validate/:token', component: TokenValidateComponent, data: { public: true } },
  { path: 'reset-password', component: PasswordResetComponent, data: { public: true } },
  { path: 'reset-password-confirm/:token', component: PasswordResetConfirmComponent, data: { public: true } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'products', loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule),canActivate: [AuthGuard]},
  { path: 'clients', loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule) ,canActivate: [AuthGuard]},
  { path: 'providers', loadChildren: () => import('./features/providers/providers.module').then(m => m.ProvidersModule) ,canActivate: [AuthGuard]},
  { path: 'sales', loadChildren: () => import('./features/sales/sales.module').then(m => m.SalesModule),canActivate: [AuthGuard]},
  { path: 'category', loadChildren: () => import('./features/categories/categories.module').then(m => m.CategoriesModule),canActivate: [AuthGuard]},
  { path: 'dashboard', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),canActivate: [AuthGuard]},
  { path: 'administration', loadChildren: () => import('./features/administration/administration.module').then(m => m.AdministrationModule),canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'home' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

