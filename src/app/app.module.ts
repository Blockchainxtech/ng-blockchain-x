import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgBlockchainXModule } from 'projects/ng-blockchain-x/src/public-api';
import { NgTailwindDatePickerModule } from 'ng-tailwind-date-picker';
import { WalletPopupComponent } from 'projects/ng-blockchain-x/src/lib/wallet-popup/wallet-popup.component';

// import { NgBlockchainXModule } from "ng-blockchainx";

@NgModule({
  declarations: [
    AppComponent,
    WalletPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgBlockchainXModule,
    NgTailwindDatePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
