import { Injectable } from '@angular/core';
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js';

@Injectable({
  providedIn: 'root'
})
export class BlockchainxHelper {

    constructor() { }

    /**
     * 
     * @param data 
     * @returns 
     */
    public decimalToHex(data: number | string) {
        let hex = Number(data).toString(16);
        while (hex.length < 2) {
            hex = '0' + hex;
        }
        return '0x'+hex;
    }   

    /**
     * 
     * @param data 
     * @returns 
     */
    public hexToDecimal(data: string): number {
        return parseInt(data, 16);
    }

    /**
     * 
     * @param data 
     * @returns 
     */
    public isHex(data: string): boolean {
        return Boolean(data.match(/^0x[0-9a-f]+$/i));
    }

    /**
     * 
     * @param multipler 
     * @param value 
     * @returns 
     */
    public decimalMultipler(multipler:number = 1, value:number = 0) {
        let decimalValue:any = 0;
        try{
            // @ts-ignore
            const web3 = new Web3(window['ethereum']);
    
            let weiValue = web3.utils.toWei(value.toString(), 'ether');
    
            switch(multipler){
                case 18:
                    decimalValue = weiValue;
                    break;
    
                case 9:
                    decimalValue = web3.utils.fromWei(weiValue, 'gwei');
                    break;
    
                case 6:
                    decimalValue = web3.utils.fromWei(weiValue, 'micro');
                    break;
    
                default:
                    decimalValue = value/10**multipler;
                    break;
            }
            return decimalValue;
        }catch(e){
            console.log('exception...',e)
        }finally{
            return decimalValue;
        }
    }

    public decimalDivider(divider:number = 1, value:number = 0) {
        // @ts-ignore
        const web3 = new Web3(window['ethereum']);
        let originalValue;
        try{
            switch(Number(divider)){
                case 18: {
                        let weiValue = web3.utils.fromWei(value.toString(), 'ether');
                        originalValue = weiValue;
                        break;
                    }
        
                case 9: {
                        let weiValue = web3.utils.fromWei(value.toString(), 'gwei');
                        originalValue = weiValue
                        break;
                    }
        
                case 6: {
                        let weiValue = web3.utils.fromWei(value.toString(), 'mwei');
                        originalValue = weiValue
                        break;
                    }
        
                default: {
                        originalValue = Number(value)/10**(18 - divider);
                        break;
                    }
            }
            return originalValue;
        }catch(e){
            console.log('conversion exception..',e)
        }finally{
            return originalValue;
        }
    }
}
