import { Component } from '@angular/core';
import { MetaMaskService, WalletConnectService } from 'projects/ng-blockchain-x/src/public-api';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// import { StorageService, MetaMaskService } from "ng-blockchainx";
import { Web3Service } from 'projects/ng-blockchain-x/src/public-api';

const abi = require('src/contracts/nifty-token.json');


@Component({
  selector: 'ang-lib-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public connectedAddress: string = '';
  public isMetamaskConnected: boolean = false;
  public contractAddress = '0xfFc57A2322B6784f95d00C06Be5E7d39866e0B1e';
  public connectedBalance: any;
  public activeChainId: any;
  public abi:any;
  public parsedAbi: any;
  public contract:any;
  public params: any[] = [];
  public outputs: any[] = [];

  constructor(private http: HttpClient, private metaMaskService: MetaMaskService, private web3Service: Web3Service, private walletConnect:WalletConnectService) {
    const self = this;
    // this.web3Service.setProvider('https://bsc-dataseed1.defibit.io/');
    // this.web3Service.connect();
    // console.log(this.web3Service.call('decimals'), 'web3 service log');
    // this.metaMaskService.connectionListener.subscribe((response:any) => { self.handler(self, response); });
    this.init();
    // this.walletConnect.openWalletConnectModal();
  }

  public setActiveDate(event: any) {
    console.log('setActiveDate', event);
  }
  public async init() {    
    // this.connectedBalance = 'Fetching balance...';
    // this.connectedBalance = await this.web3Service.getActiveWalletBalance().catch(console.log);
    // this.activeChainId = await this.metaMaskService.getChainId();
    // alert(this.activeChainId);
    this.http.get('http://localhost:3000/api/test').subscribe((resp:any) => {
      console.log('api success', resp);
    }, (error: any) => {
      console.log('api failed', error);
    })
  }

  public handler(self:any, response:any) {
    console.log(response);
    this.init();
    switch (response.code) {
      case 250601:
          self.connectionSuccess(response);
        break;
    
      case 250611:
        self.accountChanged(response);
        break;
      default:
        break;
    }
  }

  public accountChanged(response:any) {
    if (response.data.accounts.length == 0) {
      window.location.reload();
    }
  }
  public connectionSuccess(response:any) {
    this.isMetamaskConnected = true;
    this.connectedAddress = response.data.account[0];
  }

  public async changeNetwork() {
    await this.metaMaskService.changeNetwork(this.activeChainId);
  }
  public async connect() {

    
    // this.web3Service.connect();
    // console.log(await this.web3Service.getActiveWalletBalance());
    // const contract = await this.web3Service.getContract(abi, this.contractAddress);
    // console.log(await this.web3Service.getTokenBalance('0x53b2714b2c1Fadc348cf30b8C174B962ADE710eb'));
    // const balance = await this.web3Service.getBalance();
    // console.log(balance)
    this.metaMaskService.connectMetaMask()
    .then((response:any) => {
      console.log('connection status', response);
      this.isMetamaskConnected = true;
      this.connectedAddress = response.data[0];
    })
    .catch(console.dir);
  }

  public async connectWeb3() {
    const  message = {
      /*
       - Anything you want. Just a JSON Blob that encodes the data you want to send
       - No required fields
       - This is DApp Specific
       - Be as explicit as possible when building out the message schema.
      */
      contents: 'Hello, Bob!',
      attachedMoneyInEth: 4.2,
      from: {
        name: 'Cow',
        wallets: [
          '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        ],
      },
      to: [
        {
          name: 'Bob',
          wallets: [
            '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
            '0xB0B0b0b0b0b0B000000000000000000000000000',
          ],
        },
      ],
    };
    this.metaMaskService.signMessage(JSON.stringify(message)).catch(console.log);
    // console.log(JSON.parse(this.abi));
    // this.parsedAbi = JSON.parse(this.abi);
    // console.log(abi)
    // const contract = await this.web3Service.getContract(JSON.parse(this.abi), this.contractAddress );
    // this.contract = contract;
    // console.log(contract);
    // console.log(await this.web3Service.call('decimals'), 'web3 service log');
    // var somefunc = "balanceOf";
    // 0x53b2714b2c1Fadc348cf30b8C174B962ADE710eb
    // console.log(await contract.methods[somefunc]('0x9A162d24D7e3BF601a412F1a8eAf9D7D892a4742').call());
    
  }

  public async callContractFunction(method:any, abi:any) {
    console.dir(this.params)
    const parameters:any = [];
    abi?.inputs.forEach((input:any) => {
      parameters.push(this.params[input.name]);
    });
    console.dir(parameters);
    console.log(this.contract.methods[method](...parameters).call());
    this.outputs[abi?.name] = await this.contract.methods[method](...parameters).call();
  }
}
