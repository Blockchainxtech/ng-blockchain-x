import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import Web3 from "web3";

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
  private walletConnectConnection = new BehaviorSubject(RESPONSE.SERVICE_INITIALIZED);
  public connectionListener = this.walletConnectConnection.asObservable();

  constructor() {
    this.init();
  }

  public init() {
    this.walletConnect = new WalletConnect({
      bridge: WALLET_CONNECT_URI, // Required
    });
    // this.walletConnect.killSession();
    this.walletConnectListeners();
  }

  /**
   * wallet connect listeners
   */
  public walletConnectListeners() {
    let self = this;
    this.walletConnect.on(WALLET_CONNECT_EVENTS.CONNECT, (error: any, payload: any) => {
      this.onConnect(self, error, payload)
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.SESSION_UPDATE, (error: any, payload: any) => {
      this.onSessionUpdate(self, error, payload)
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.DISCONNECT, (error: any, payload: any) => {
      this.onDisconnect(self, error, payload)
    });
  }

  public onConnect(self: any, error: any, payload: any) {
    if (error) {
      throw error;
    }
    // Close QR Code Modal
    QRCodeModal.close();
    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    const response = RESPONSE.WALLET_CONNECT_CONNECTED;
    response.data = Object.assign({}, { account: accounts, chainId: chainId });
    self.connectionStatusUpdate(response);
  }

  public onDisconnect(self: any, error: any, payload: any) {
    if (error) {
      throw error;
    }
    const response = RESPONSE.WALLET_CONNECT_DISCONNECTED;

    self.connectionStatusUpdate(response);
  }

  public onSessionUpdate(self: any, error: any, payload: any) {
    if (error) {
      throw error;
    }
    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    const response = RESPONSE.WALLET_CONNECT_CHANGED;
    response.data = Object.assign({}, { account: accounts, chainId: chainId });
    self.connectionStatusUpdate(response);
  }

  /**
   *
   * @param message
   */
  public connectionStatusUpdate(response: CustomResponse) {
    this.walletConnectConnection.next(response);
  }

  public openWalletConnectModal() {
    if (!this.walletConnect.connected) {
      // create new session
      this.walletConnect.createSession().then(() => {
        // get uri for QR Code modal
        const uri = this.walletConnect.uri;
        // display QR Code modal
        QRCodeModal.open(uri, () => {
          this.init();
        });
      });
    }
  }
}
