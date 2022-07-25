import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ETHEREUM_METHODS, META_MASK_EVENTS, CHAIN_ID, ERRORS, RESPONSE } from './meta-mask.constants';
import { chainInfo } from './meta-mask.mock';

import { ProviderRpcError, AddCustumTokenParam, AddTokenParam, CustomResponse, SimpleResponse} from './meta-mast.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MetaMaskService {

  private metaMask: any;
  public isMetaMaskConnected: boolean = false;
  private supportedChains: string[] = [];

  // meta mask connection subject to broadcast connection state
  private metaMaskConnection = new BehaviorSubject(RESPONSE.SERVICE_INITIALIZED);
  public connectionListener: Observable<any> = this.metaMaskConnection.asObservable();

  constructor() { this.onInit(); }

  public setSupportedChains(chains: string[]) {
    this.supportedChains = chains;
  }

  public chainDetails(chainId: string) { return chainInfo(chainId); };

  /**
   * On init function called on service initialisation
   */
  public async onInit() {
    // @ts-ignore
    if (window['ethereum'] == undefined) {
      this.connectionStatusUpdate(ERRORS.METAMASK_NOT_INSTALLED);
    } else {
      // @ts-ignore
      this.metaMask = window['ethereum']; 
      this.getAddress()
        .then(async (accounts: Array<string>) => {
          if (accounts.length === 0) {
            this.connectionStatusUpdate(ERRORS.METAMASK_NOT_CONNECTED);
          } else {
            this.isMetaMaskConnected = true;
            this.metaMaskEventListeners();
            const response = RESPONSE.METAMASK_CONNECTED;
            const chainId = await this.getChainId().catch(console.log);
            response.data = Object.assign({}, {account: accounts, chainId: chainId});
            this.connectionStatusUpdate(response);
          }
        })
        .catch((error: any) => {
          const response = ERRORS.UNHANDLED_ERROR;
          response.data = Object.assign({}, {error: error});
          this.connectionStatusUpdate(response);          
        });
    }
  }

  /**
   * getter function of connection status
   */
  get isConnected() { return this.isMetaMaskConnected; };

  /**
   * 
   * @param chainId 
   */
  public async networkHandler() {
    const chainId = await this.getChainId().catch(console.log);
    if (this.supportedChains.length > 0 && this.supportedChains.indexOf(chainId) == -1) {
      // connected network is not supported network
      this.metaMaskConnection.next(RESPONSE.CHAIN_NOT_SUPPORTED);
    }
    if (this.supportedChains.length == 0) {
      this.metaMaskConnection.next(RESPONSE.CHAIN_NOT_SUPPORTED);
    }
  }

  /**
   * 
   * @param message 
   */
  public connectionStatusUpdate(response: CustomResponse) {
    this.networkHandler();
    this.metaMaskConnection.next(response);
  }

  /**
   * Metamask event listeners 
   */
   public metaMaskEventListeners() {
    const self = this;
    this.metaMask.on(META_MASK_EVENTS.ACCOUNT_CHANGED,(accounts: any) => {
      this.onAccountChanged(self, accounts);
    });
    this.metaMask.on(META_MASK_EVENTS.CHAIN_CHANGED, (chainId:string) => {
      this.onChainChanged(self, chainId);
    });
    this.metaMask.on(META_MASK_EVENTS.CLOSE, (error:ProviderRpcError) => {
      this.onClose(self, error);
    });
  }

  /**
   * 
   * @returns chainId string
   */
  public async getChainId() {
    const chainId = await this.metaMask.request(ETHEREUM_METHODS.REQUEST_CHAINID);
    return chainId;
  }

  /**
   * 
   * @returns 
   */
  public async getAddress() : Promise<string[]>{
    return new Promise((resolve, reject) => {
      this.metaMask
        .request(ETHEREUM_METHODS.REQUEST_ETH_ACCOUNT)
        .then((accounts: Array<string>) => {
          resolve(accounts);
        })
        .catch(reject);
    })
  }

  /**
   * 
   * @param chainId 
   */
  public async changeNetwork(chainId: string) {
    return await this.metaMask.request(({ method: ETHEREUM_METHODS.REQUEST_CHANGE_CHAIN, params:[{chainId: chainId}]}));
  }

  /**
   * 
   * @returns 
   */
   public async connectMetaMask() : Promise<SimpleResponse> {
    return new Promise(async (resolve, reject) => {
      const chainId = await this.getChainId();
      await this.metaMask.request(ETHEREUM_METHODS.REQUEST_ACCOUNTS)
      .then((response:any) => {
        this.metaMaskEventListeners();
        resolve( { status:true, data: response, chainId: chainId } );
      })
      .catch((error:any) => {
        reject ( { status:false, data: error } );
      });
    })
  }

  /**
   * 
   * @param accounts 
   */
  public onAccountChanged(self: any, accounts:any) {
    const response = RESPONSE.ACCOUNT_CHANGED;
    response.data = Object.assign({}, { accounts: accounts});
    self.connectionStatusUpdate(response); 
  }

  /**
   * 
   * @param chainId 
   */
  public onChainChanged(self: any, chainId:string) {
    const response = RESPONSE.CHAIN_CHANGED;
    response.data = Object.assign({}, { chainId: chainId});
    self.connectionStatusUpdate(response);
  }

  /**
   * 
   * @param chainId 
   */
  public onClose(self:any, error:ProviderRpcError) {
    const response = RESPONSE.CONNECTION_CLOSED;
    response.data = Object.assign({}, { error: error});
    self.connectionStatusUpdate(response);
  }

  /**
   * 
   * @param param 
   * @returns Promise<>
   */
  public addCustomToken(param: AddCustumTokenParam) {
    return new Promise((resolve, reject) => {
      this.metaMask.request({
        method: ETHEREUM_METHODS.REQUEST_WALLET_WATCH_ASSET,
        params: param
      })
      .then((success:any) => {
        resolve(success);
      })
      .catch((error:any) => {
        reject(error);
      });
    });
  }

  /**
   * 
   * @param message 
   */
  public async signMessage(message: any) {
    return new Promise((resolve, reject) => {
      this.getAddress().then(async (accounts:any) => {
        const signature = await this.metaMask.request({
          method: 'personal_sign',
          params: [message, accounts[0], message],
        }).catch((error:any) => {
          reject(error);
        })
        resolve(signature);
      });
    })
    
  }

  /**
   * 
   * @param param 
   * @returns Promise<>
   */
  public addNetwork(param: AddTokenParam) {
    return new Promise((resolve, reject) => {
      this.metaMask.request(param)
        .then((success:any) => {
          resolve(success);
        })
        .catch((error:any) => {
          reject(error);
        });
    });
  }

}
