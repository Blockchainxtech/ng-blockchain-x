export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
  
interface AddCustumTokenOptions {
    address: string;
    symbol: string;
    decimals: number;
    image: string;
}
  
export interface ApproveParam {
    amount: number;
    approveContract: any;
    from: string;
    to: string;
    data: string;
}

export interface AddCustumTokenParam {
    type: string;
    options: AddCustumTokenOptions;
}



interface NativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
}

interface Param {
    chainId: string;
    chainName: string;
    nativeCurrency: NativeCurrency;
    rpcUrls: string[];
    blockExplorerUrls: string[];
}

export interface AddTokenParam {
    method: string;
    params: Param[];
}



interface Data {
}

export interface CustomResponse {
    status: boolean;
    code: number;
    message: string;
    data: Data | undefined | any;
}

export interface SimpleResponse {
    status: boolean;
    data: any;
    chainId: string | undefined | unknown;
}