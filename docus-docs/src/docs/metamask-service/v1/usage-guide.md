---
sidebar_position: 1
---
:::tip My tip

Use this awesome feature option

:::

#### Setup metamask service


```typescript 

// import Metamask service on component in which you need
import { MetaMaskService } from "ng-blockchainx";

// add metamask service as DI ( dependency injection )
constructor(private metaMaskService: MetaMaskService) {}

```

#### To connect metamask wallet 

```typescript 

this.metaMaskService.connectMetaMask()
.then((response:any) => {
    // DO your success logic here
})
.catch((error:any) => {
    // DO your failure logic here
});

```


Once metamask successfully connected need to pass what are the networks your application going to support by passing their corresponding chain id's. 

```typescript
this.metaMaskService.setSupportedChains(['0x61', '0x38']);
```
In above example ```['0x61', '0x38']``` are the chain id's of BSC testnet and mainnet

#### To change active network on metamask wallet 

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
| 250641 | Current network is not supported |  |