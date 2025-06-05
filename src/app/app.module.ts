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
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { SalesModule } from './features/sales/sales.module';
import { LOCALE_ID } from '@angular/core';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProductsModule,
    ClientsModule,
    MaterialModule,
    SalesModule,
    HttpClientModule
  ],
  exports:[],
  providers: [
     { provide: LOCALE_ID, useValue: 'es-CO' },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
