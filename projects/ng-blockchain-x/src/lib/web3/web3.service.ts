import { Injectable } from '@angular/core';

// @ts-ignore
import Web3 from 'web3/dist/web3.min.js';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { chainInfo } from '../meta-mask/meta-mask.mock';

import { connectParams, connectResponse, ETHsendTransactionParam, SendTransactionParam, ApproveParam } from './web3-interfaces';

@Injectable({
    providedIn: 'root'
})
export class Web3Service {

    public web3: any;
    public ethWeb3: any;
    public contract: any;
    public account: string = '';

    constructor() {
        // @ts-ignore
        this.ethWeb3 = new Web3(window['ethereum']);
    }

    /**
     * Returns web3 service
     * @param connectionParams 
     * @param walletType  1- metamask, 2- wallet connect
     * @returns connect 
     */
    public async connect(connectionParams: connectParams, walletType: number = 1): Promise<connectResponse> {

        return new Promise(async (resolve, reject) => {
            const chainDetail = chainInfo(connectionParams.chainId);

            if (connectionParams.rpcUrl) {
                if (walletType == 2) {
                    //  Create WalletConnect Provider
                    const provider = new WalletConnectProvider({
                        infuraId: connectionParams.infuraApiKey, // Required
                    });
                    //  Enable session (triggers QR Code modal)
                    await provider.enable();
                    this.web3 = new Web3(provider);
                } else {
                    this.web3 = new Web3(connectionParams.rpcUrl);
                }
                const accounts = await this.web3.eth.getAccounts().catch(console.log);
                this.account = accounts[0];
                resolve({ status: true, message: 'Web3 connected successfully', account: this.account });
            } else {
                if (chainDetail.rpc == undefined || chainDetail.rpc.length == 0) {
                    // need rpcUrl
                    reject({ status: false, message: 'RPC url needed for this network', account: null });
                } else {
                    if (chainDetail.rpc[0].includes('${INFURA_API_KEY}') == true) {
                        // need infura api key
                        if (!connectionParams.infuraApiKey) {
                            reject({ status: false, message: 'Infura api key needed for this network', account: null });
                        } else {
                            const rpcUrl = chainDetail.rpc[0].replace('${INFURA_API_KEY}', connectionParams.infuraApiKey);
                            if (walletType == 2) {
                                //  Create WalletConnect Provider
                                const provider = new WalletConnectProvider({
                                    infuraId: connectionParams.infuraApiKey, // Required
                                });
                                this.web3 = new Web3(provider);
                            } else {
                                this.web3 = new Web3(rpcUrl);
                            }
                            const accounts = await this.web3.eth.getAccounts().catch(console.log);
                            this.account = accounts[0];
                        }
                    } else {
                        this.web3 = new Web3(chainDetail.rpc[0]);
                        const accounts = await this.web3.eth.getAccounts().catch(console.log);
                        this.account = accounts[0];
                    }
                    resolve({ status: true, message: 'Web3 connected successfully', account: this.account });
                }
            }

        });
    }

    public get web3Eth() { return this.ethWeb3; }

    /**
     * 
     * @returns 
     */
    public getActiveWalletBalance() {
        return new Promise(async (resolve, reject) => {
            const self = this;
            this.web3.eth.getBalance(this.account, (err: any, result: any) => {
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
    public async decimals() {
        return (await this.contract.methods.decimals().call());
    }

    /**
     * 
     * @param ABI 
     * @param contractAddress 
     * @returns 
     */
    public async getContract(ABI: any, contractAddress: any) {
        const contractParam = {
            from: this.account
        };
        return this.contract = await new this.web3.eth.Contract(ABI, contractAddress, contractParam);
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
        return (await this.contract.methods.allowance(owner, spender).call());
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

    public sendTransaction(data: SendTransactionParam) {
        return new Promise(async (resolve, reject) => {
            const parameter: ETHsendTransactionParam = {
                method: 'eth_sendTransaction',
                from: this.web3.utils.toChecksumAddress(data.fromAddress),
                to: data.toAddress,
                data: data.abi,
            }
            if (data.chainId) {
                parameter.chainId = data.chainId;
            }
            if (data.value) {
                parameter.value = data.value;
            }
            this.ethWeb3.eth.sendTransaction(parameter).then(resolve).catch(reject);
        });
    }

    /**
     * 
     * @param functionName 
     * @param params 
     * @returns 
     */
    public async encodeABI(functionName: string, ...params: any) {
        return (await this.contract.methods[functionName](...params).encodeABI());
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