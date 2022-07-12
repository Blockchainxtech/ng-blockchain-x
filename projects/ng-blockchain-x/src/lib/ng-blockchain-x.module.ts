import { NgModule } from '@angular/core';
import { ConnectWalletComponent } from './connect-wallet.component';
import { NgBlockchainXComponent } from './ng-blockchain-x.component';


@NgModule({
  declarations: [
    NgBlockchainXComponent,
    ConnectWalletComponent
  ],
  imports: [
  ],
  exports: [
    NgBlockchainXComponent,
    ConnectWalletComponent
  ]
})
export class NgBlockchainXModule { }
