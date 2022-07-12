import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import Web3 from 'web3';

interface ApproveParam {
    amount: number;
    approveContract: any;
    address: string;
    toAddress: string;
    chainId: string;
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

    // @ts-ignore
    public provider: any = 'https://data-seed-prebsc-1-s1.binance.org:8545/';// window['ethereum'];
    public web3: any;
    public contract: any;
    public account: string = '';

    /**
     * 
     * @param provider 
     */
    public setProvider(provider: any) {
        this.provider = provider;
    }

    /**
     * 
     * @returns 
     */
    public async connect() {
        this.web3 = new Web3(this.provider);
        const accounts = await this.web3.eth.getAccounts().catch(console.log);
        this.account = accounts[0];
        return this;
    }

    /**
     * 
     * @returns 
     */
    public getActiveWalletBalance() {
        this.web3 = new Web3(this.provider);
        return new Promise(async (resolve, reject) => {
            const self = this;
            const accounts = await this.web3.eth.getAccounts().catch(console.log);
            const account = accounts[0];
            this.web3.eth.getBalance(account, (err:any, result:any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(self.web3.utils.fromWei(result, "ether"));
                }
            })
        });
    }

    /**
     * 
     * @returns 
     */
    public async decimals(){
        return(await this.contract.methods.decimals().call());
    }

    /**
     * 
     * @param ABI 
     * @param contractAddress 
     * @returns 
     */
    public getContract(ABI: any, contractAddress: any) {
       return this.contract = new this.web3.eth.Contract(ABI, contractAddress,{
        from: this.account});
    }

    /**
     * 
     * @param address 
     * @returns 
     */
    public async getTokenBalance(address: string) {
        return (await this.contract.methods.balanceOf(address).call());
    }

    /**
     * 
     * @param owner 
     * @param spender 
     * @returns 
     */
    public async getAllowance(owner: string, spender: string) {
        return(await this.contract.methods.allowance(owner, spender).call());
    }

    /**
     * 
     * @param data { ApproveParam }
     * @returns Promise<>
     */
    public approve(data: ApproveParam) {

        return new Promise(async (resolve, reject) => {
            const approveAbi = await this.contract.methods.approve(data.approveContract, data.amount).encodeABI();
            const parameter = {
                method: 'eth_sendTransaction', 
                from: this.web3.utils.toChecksumAddress(data.address),
                to: data.toAddress,
                data: approveAbi,
                chainId: data.chainId
            }
            this.web3.eth.sendTransaction(parameter).then(resolve).catch(reject);
        });
        
    }

    /**
     * 
     * @param functionName 
     * @param params 
     * @returns 
     */
    public async call(functionName: string, ...params: any) {
        return (await this.contract.methods[functionName](...params).call());
    }

    /**
     * 
     * @param functionName 
     * @param params 
     * @returns 
     */
    public async send(functionName: string, ...params: any) {
        return (await this.contract.methods[functionName](...params).send());
    }

}