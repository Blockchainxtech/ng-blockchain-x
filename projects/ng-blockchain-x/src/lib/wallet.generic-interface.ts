import { Observable } from "rxjs";




interface WalletInterface
{
    connectionListener: Observable<any>;

    connect(params: any): void;

    chainId() : string;

    changeChain(chain: string): void;

    addNewNetwork(): void;

    onAccountChanged(): void;

    onChainChanged(): void;
};