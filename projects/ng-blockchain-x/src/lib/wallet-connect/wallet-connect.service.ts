import { Injectable } from '@angular/core';
import { WALLET_CONNECT_EVENTS, RESPONSE } from './wallet-connect.constants';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { ProviderRpcError } from '../meta-mask/meta-mast.interfaces';

// const connector = new WalletConnect({
//   bridge: "https://bridge.walletconnect.org", // Required
// });


@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {
  walletConnect: any;
  connector: any;
  accountName:any;
  chainIdName:any;
  constructor() { this.init(); }

  public init() {
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
    });
    this.connector.on("connect", (error: any, payload: { params: { accounts: any; chainId: any; }[]; }) => {
      if (error) {
        throw error;
      }

      // Close QR Code Modal
      QRCodeModal.close();

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });
  }
  /**
   * Open Wallet Connect Modal
   */
  public openWalletConnectModal() {
    if (!this.connector.connected) {
      // create new session
      this.connector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = this.connector.uri;
        // display QR Code modal
        QRCodeModal.open(uri, () => {
          console.log("QR Code Modal closed");
          this.init();
        });
      });
    }
    this.wallectConnectListener();
  }
  
  /**
   * Wallect Connect Listener
   */
  public wallectConnectListener() {
    this.connector.on(WALLET_CONNECT_EVENTS.ACCOUNT_CHANGED, (accounts: any) => {
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.CHAIN_CHANGED, (chainId: string) => {
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.CLOSE, (error: ProviderRpcError) => {
    });
  }


}