import { Injectable } from '@angular/core';
import { WALLET_CONNECT_EVENTS, RESPONSE } from './wallet-connect.constants';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { ProviderRpcError } from '../meta-mask/meta-mast.interfaces';

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
});


@Injectable({
  providedIn: 'root'
})
export class WalletConnectService {
  walletConnect: any;
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
  /**
   * Open Wallet Connect Modal
   */
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
    this.wallectConnectListener();
  }
  /**
   * Wallect Connect Listener
   */
  public wallectConnectListener() {
    const self = this;
    this.walletConnect.on(WALLET_CONNECT_EVENTS.ACCOUNT_CHANGED, (accounts: any) => {
      this.onAccountChanged(self, accounts);
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.CHAIN_CHANGED, (chainId: string) => {
      this.onChainChanged(self, chainId);
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.CLOSE, (error: ProviderRpcError) => {
      this.onClose(self, error);
    });
  }

  /**
 * 
 * @param accounts 
 */
  public onAccountChanged(self: any, accounts: any) {
    const response = RESPONSE.ACCOUNT_CHANGED;
    response.data = Object.assign({}, { accounts: accounts });
    self.connectionStatusUpdate(response);
  }

  /**
   * 
   * @param chainId 
   */
  public onChainChanged(self: any, chainId: string) {
    const response = RESPONSE.CHAIN_CHANGED;
    response.data = Object.assign({}, { chainId: chainId });
    self.connectionStatusUpdate(response);
  }

  /**
   * 
   * @param chainId 
   */
  public onClose(self: any, error: ProviderRpcError) {
    const response = RESPONSE.CONNECTION_CLOSED;
    response.data = Object.assign({}, { error: error });
    self.connectionStatusUpdate(response);
  }
}