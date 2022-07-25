export interface ApproveParam {
    amount: number;
    approveContract: any;
    address: string;
    toAddress: string;
    chainId: string;
}

export interface connectParams {
    chainId: string;
    rpcUrl?: string;
    infuraApiKey?: string;
}

export interface connectResponse {
    status: boolean;
    message: string;
    account: any;
}

export interface SendTransactionParam {
    fromAddress: string;
    toAddress: string;
    abi: any;
    value?: any;
    chainId?: string;
}

export interface ETHsendTransactionParam {
    method: string;
    from: string;
    to: string;
    data: any;
    value?: any;
    chainId?: string;
}