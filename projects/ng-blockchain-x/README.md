# NgBlockchainX

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Meta mask service

```typescript 

// import Metamask service on component in which you need
import { MetaMaskService } from "ng-blockchainx";

// add metamask service as DI ( dependency injection )
constructor(private metaMaskService: MetaMaskService) {}

```

### To connect metamask wallet 

```typescript 

this.metaMaskService.connectMetaMask()
.then((response:any) => {
    // DO your success logic here
})
.catch((error:any) => {
    // DO your failure logic here
});

```

### To change active network on metamask wallet 

```typescript 
// 'chainId = chain id of the network which to be active
this.metaMaskService.changeNetwork('chainID')
.then((response:any) => {
    // DO your success logic here
})
.catch((error:any) => {
    // DO your failure logic here
});

```



```typescript

export interface Response {
    status: boolean;
    code: number;
    message: string;
    data: Data | undefined | any;
}

this.metaMaskService.connectionListener.subscribe((response:Response) => {
    console.log(response);
    // Do your logic here
});

```

| Response code | Message | Description |
| :---: | :---: | :---: |
| 250511 | Metamask not installed on browser |  |
| 250512 | Metamask not connected |  |
| 250500 | Un expected error |  |
| 250601 | Metamask connected successfully |  |
| 250609 | Service init success | Just ignore this event |
| 250610 | Chain changed |  |
| 250611 | account changed |  |
| 250612 | metamask connection closed |  |

## Web3 service 

If you are using Angular version >11 and run into an issue building. This is because polyfills are not included in the newest version of Angular.

- Install the required dependencies within your angular project:

```bash
npm install --save-dev crypto-browserify next-tick stream-browserify assert stream-http https-browserify os-browserify
```

- Within `tsconfig.json` add the following `paths` in `compilerOptions` so Webpack can get the correct dependencies

```typescript
{
    "compilerOptions": {
        "paths" : {
        "crypto": ["./node_modules/crypto-browserify"],
        "stream": ["./node_modules/stream-browserify"],
        "assert": ["./node_modules/assert"],
        "http": ["./node_modules/stream-http"],
        "https": ["./node_modules/https-browserify"],
        "os": ["./node_modules/os-browserify"],
    }
}
```

- Add the following lines to `polyfills.ts` file:

```typescript
import { Buffer } from 'buffer';

(window as any).global = window;
global.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
} as any;
```

- Create webpack.config.js file on root path and add below code 

```js

{
    resolve: {
        fallback: {
            url: require.resolve("url/")
        }
    }
}

```

after run npm install url

Once above setup done add below code into the component where you need web3service

```typescript 

// import Web3Service on component in which you need by adding below line
import { Web3Service } from "ng-blockchainx";

// add metamask service as DI ( dependency injection )
constructor(private web3Service: Web3Service) {}

```