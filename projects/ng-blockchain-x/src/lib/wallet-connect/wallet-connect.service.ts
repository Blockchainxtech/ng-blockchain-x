import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  WALLET_CONNECT_EVENTS,
  RESPONSE,
  CustomResponse,
  WALLET_CONNECT_URI,
} from "./wallet-connect.constants";


@Injectable({
  providedIn: "root",
})

export class WalletConnectService {
  private walletConnect: any;

  // meta mask connection subject to broadcast connection state
  private walletConnectConnection = new BehaviorSubject(
    RESPONSE.SERVICE_INITIALIZED
  );
  public connectionListener = this.walletConnectConnection.asObservable();

  constructor() {
    this.init();
  }

  public init() {
    this.walletConnect = new WalletConnect({
      bridge: WALLET_CONNECT_URI, // Required
    });
    this.walletConnectListeners();
  }
  /**
   * wallet connect listeners
   */
  public walletConnectListeners() {
    this.walletConnect.on(WALLET_CONNECT_EVENTS.CONNECT, this.onConnect);
    this.walletConnect.on(WALLET_CONNECT_EVENTS.SESSION_UPDATE, this.onSessionUpdate);
    this.walletConnect.on(WALLET_CONNECT_EVENTS.DISCONNECT, this.onDisconnect);
  }

  public onConnect(self: any, error: any, payload: any) {
    if (error) {
      throw error;
    }
    // Close QR Code Modal
    QRCodeModal.close();
    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    console.log(accounts, chainId);
    const response = RESPONSE.WALLET_CONNECT_CONNECTED;
    response.data = Object.assign({}, { account: accounts, chainId: chainId });
    self.walletConnectionStatusUpdate(response);
  }

  public onDisconnect(self: any,error: any, payload: any) {
    if (error) {
      throw error;
    }
    const response = RESPONSE.WALLET_CONNECT_DISCONNECTED;
    self.walletConnectionStatusUpdate(response);
  }

  public onSessionUpdate(self: any, error: any, payload: any) {
    if (error) {
      throw error;
    }
    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    const response = RESPONSE.WALLET_CONNECT_CHANGED;
    response.data = Object.assign({}, { account: accounts, chainId: chainId });
    self.walletConnectionStatusUpdate(response);
    // this.walletConnectConnection.next(response);
  }

  

  public openWalletConnectModal() {
    if (!this.walletConnect.connected) {
      // create new session
      this.walletConnect.createSession().then(() => {
        // get uri for QR Code modal
        const uri = this.walletConnect.uri;
        // display QR Code modal
        QRCodeModal.open(uri, () => {
          console.log("QR Code Modal closed");
          this.init();
        });
      });
    }
    this.walletConnectListeners();
  }
  /**
   *
   * @param message
   */
 walletConnectionStatusUpdate(response: CustomResponse) {
  console.log("response",response);
  
  this.walletConnectConnection.next(response);
}
}
