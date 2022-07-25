import { Component, OnInit } from '@angular/core';
import { MetaMaskService, WalletConnectService } from 'projects/ng-blockchain-x/src/public-api';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// import { StorageService, MetaMaskService } from "ng-blockchainx";
import { Web3Service } from 'projects/ng-blockchain-x/src/public-api';
import { getAddNetworkParam } from 'projects/ng-blockchain-x/src/lib/meta-mask/meta-mask.mock';

const abi = require('src/contracts/nifty-token.json');

import { chains } from 'projects/ng-blockchain-x/src/lib/meta-mask/meta-mask.mock';

@Component({
  selector: 'ang-lib-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  public metaMaskConnected: boolean = false;
  public showChainNotSupportedError: boolean = false;
  public messageToSign: string = '';
  public connectedChain: any;
  public walletAddress: string = '';
  public selectedNetwork: string = '';
  public chains: any;

  constructor(private http: HttpClient, private metaMaskService: MetaMaskService, private web3Service: Web3Service, private walletConnect:WalletConnectService,
    private walletConnectService:WalletConnectService) {
  }

  async ngOnInit() {
    console.log(`AppComponent : ngOnInit`);
    console.dir(`meta mask connection status : ${JSON.stringify(getAddNetworkParam('0x61'))}`);
    this.chains = chains;
    this.metaMaskService.setSupportedChains(['0x61', '0x38']);
    
    const accounts: any = await this.metaMaskService.getAddress().catch((error: any) => {
      console.log(error);
    });
    console.log(accounts[0])
    if (accounts.length > 0) {
      this.metaMaskConnected = true;
      this.walletAddress = accounts[0];
    } 

    this.metaMaskService.connectionListener.subscribe((response: any) => {
      console.log(response);
      this.metaMaskResponseHandler(response);
    });
  }


  public getNameFromChain(chain: any, key: string) {
    return chain[key];
  }

  public async addNetwork() {
    // alert(this.selectedNetwork);
    console.log(getAddNetworkParam(this.selectedNetwork));
    await this.metaMaskService.addNetwork(getAddNetworkParam(this.selectedNetwork));
  }
  public changeNetwork(chainId: string) {
    const param: any = getAddNetworkParam(chainId);
    if (param != false) this.metaMaskService.addNetwork(param);
  }

  metaMaskResponseHandler(response: any) {
    switch (response.code) {
      case 250641:
          // connected chain not supported network
          this.showChainNotSupportedError = true;
        break;
      case 250610:
          window.location.reload();
        break;
      case 250601:
          this.connectedChain = this.metaMaskService.chainDetails(response.data.chainId);
        break;
      default:
        break;
    }
  }

  /**
   * 
   */
  async connect() {
    this.metaMaskService.connectMetaMask();
  }


  public async signMessage() {
    if (this.messageToSign) {
      const signature = await this.metaMaskService.signMessage(this.messageToSign);
      console.log('signature', signature);
    } else {
      alert('Enter message to sign');
    }

  }
}
