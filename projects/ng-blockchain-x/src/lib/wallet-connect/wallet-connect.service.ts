import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import Web3 from 'web3';

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
});
  

@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {

    constructor() { this.init(); }

    public init() {
      connector.on("connect", (error, payload) => {
          if (error) {
            throw error;
          }
        
          // Close QR Code Modal
          QRCodeModal.close();
        
          // Get provided accounts and chainId
          const { accounts, chainId } = payload.params[0];
          console.log(accounts, chainId);
      });
    }

    public openWalletConnectModal() {
      if (!connector.connected) {
          // create new session
          connector.createSession().then(() => {
            // get uri for QR Code modal
            const uri = connector.uri;
            // display QR Code modal
            QRCodeModal.open(uri, () => {
              console.log("QR Code Modal closed");
              this.init();
            });
          });
      }
    }

    
}