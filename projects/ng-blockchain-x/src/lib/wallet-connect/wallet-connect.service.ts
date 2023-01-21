import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// @ts-ignore
import Web3 from 'web3/dist/web3.min.js';

import { ApproveParam } from './wallet-connect.interfaces'
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import {
  WALLET_CONNECT_EVENTS,
  RESPONSE,
  CustomResponse,
  WALLET_CONNECT_URI,
  ETHEREUM_METHODS,
} from './wallet-connect.constants';
import { BlockchainxHelper } from '../helper.service';

@Injectable({
  providedIn: 'root',
})
export class WalletConnectService {
  private walletConnect: any;

  // meta mask connection subject to broadcast connection state
  private walletConnectConnection = new BehaviorSubject(RESPONSE.SERVICE_INITIALIZED);
  public connectionListener = this.walletConnectConnection.asObservable();


  contract: any;

  constructor(private helper: BlockchainxHelper) {
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
    const self = this;
    this.walletConnect.on(WALLET_CONNECT_EVENTS.CONNECT, (error: any, payload: any) => {
      this.onConnect(self, error, payload);
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.SESSION_UPDATE, (error: any, payload: any) => {
      this.onSessionUpdate(self, error, payload);
    });
    this.walletConnect.on(WALLET_CONNECT_EVENTS.DISCONNECT, (error: any, payload: any) => {
      this.onDisconnect(self, error, payload);
    });
  }

  public onConnect(self: any, error: any, payload: any) {
    if (error) {
      throw error;
    }
    // Close QR Code Modal
    QRCodeModal.close();
    // Get provided accounts and chainId
    console.log('params', payload.params[0]);
    const { accounts, chainId } = payload.params[0];
    const response = RESPONSE.WALLET_CONNECT_CONNECTED;
    const chainIdInHex = this.helper.decimalToHex(chainId);
    response.data = Object.assign({}, { account: accounts, chainId: chainIdInHex });
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
    const chainIdInHex = this.helper.decimalToHex(chainId);
    response.data = Object.assign({}, { account: accounts, chainId: chainIdInHex });
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

  /**
   * Send Transaction
   * @param {any} params
   * @returns {promise}
   */
  public async send(...params: any) {
    return new Promise((resolve, reject) => {
      this.walletConnect.sendTransaction(params[0])
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error)
        });
    })
  }

  /**
    * 
    * @param data { ApproveParam }
    * @returns Observable
    */
  public approve(data: ApproveParam) {
    const parameter = {
      method: 'eth_sendTransaction',
      from: data.from,
      to: data.to,
      data: data.data,
    }
    return new Promise((resolve, reject) => {
        this.walletConnect.sendTransaction(parameter)
          .then((result: any) => {
            resolve(result);
          })
          .catch((error: any) => {
            reject(error)
          });
    })
  }

  /**
   * 
   * @param {array} data 
   * @returns 
   */
  public async signMessage(data: any) {
    return new Promise((resolve, reject) => {
      this.walletConnect.sendTransaction(
        {
          to: data[2],
          from: data[0],
          method: 'eth_signTypedData',
          params: [data[0], data[1]],
        }).then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error)
        });
    })
  }

  public async getAddress(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.walletConnect
        .request(ETHEREUM_METHODS.REQUEST_ETH_ACCOUNT)
        .then((accounts: Array<string>) => {
          resolve(accounts);
        })
        .catch(reject);
    })
  }
}
