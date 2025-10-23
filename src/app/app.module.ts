import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ProductsModule } from './features/products/products.module';
import { MaterialModule } from './shared/material/material.module';
import { ClientsModule } from './features/clients/clients.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { SalesModule } from './features/sales/sales.module';
import { LOCALE_ID } from '@angular/core';
import { AlertDialogComponent } from './shared/components/alert-dialog/alert-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './shared/components/login/login.component';
import { PasswordResetComponent } from './shared/components/password-reset/password-reset.component';
import { TokenValidateComponent } from './shared/components/token-validate/token-validate.component';
import { PasswordResetConfirmComponent } from './shared/components/password-reset-confirm/password-reset-confirm.component';
import { AuthInterceptor } from './shared/interceptors';
import { EmailValidateComponent } from './shared/components/email-validate/email-validate.component';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    LoginComponent,
    PasswordResetComponent,
    TokenValidateComponent,
    PasswordResetConfirmComponent,
    EmailValidateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProductsModule,
    ClientsModule,
    MaterialModule,
    SalesModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,

  ],
  exports:[],
  providers: [
     { provide: LOCALE_ID, useValue: 'es-CO' },
     {
       provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptor,
       multi: true
     },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
