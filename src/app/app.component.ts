import { Component, OnInit } from '@angular/core';
import { MetaMaskService, WalletConnectService } from 'projects/ng-blockchain-x/src/public-api';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// import { StorageService, MetaMaskService } from "ng-blockchainx";
import { Web3Service } from 'projects/ng-blockchain-x/src/public-api';
import { getAddNetworkParam } from 'projects/ng-blockchain-x/src/lib/meta-mask/meta-mask.mock';
// import { WalletConnectService } from 'projects/ng-blockchain-x/src/lib/wallet-connect/wallet-connect.service';


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
    this.walletConnectService.openWalletConnectModal();
    this.walletConnectService.connectionListener.subscribe((response: any) => {
      console.log('wallet connect response',response);
    })
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

    this.web3Service.connect({chainId: '0x61'});

    const abi: any = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"_decimal","type":"uint8"},{"internalType":"uint256","name":"totalSupply","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const contract = await this.web3Service.getContract(abi, '0x42050E29316a2EC1A66eb055D6EF73fc8B9580c8');
    console.log(await contract.methods.balanceOf('0x577b282078912c354b3f4b503c97Bf2770eCe2cC').call());
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
