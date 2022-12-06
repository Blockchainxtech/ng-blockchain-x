export const WALLET_CONNECT_EVENTS = {
    CONNECT: 'connect',
    SESSION_UPDATE: 'session_update',
    DISCONNECT: 'disconnect'
}

export const WALLET_CONNECT_URI = 'https://bridge.walletconnect.org';

export const RESPONSE = {
    WALLET_CONNECT_DISCONNECTED: {
        status: true,
        code: 250700,
        message: 'Wallet disconnected successfully',
        data: {

        }
    },
    WALLET_CONNECT_CONNECTED: {
        status: true,
        code: 250601,
        message: 'Wallet connected successfully',
        data: {

        }
    },
    SERVICE_INITIALIZED: {
        status: true,
        code: 250609,
        message: 'Service init success',
        data: {

        }
    },
    CHAIN_CHANGED: {
        status: true,
        code: 250610,
        message: 'chain changed',
        data: {

        }
    },
    WALLET_CONNECT_CHANGED: {
        status: true,
        code: 250611,
        message: 'wallet account changed',
        data: {

        }
    },
    CONNECTION_CLOSED: {
        status: true,
        code: 250612,
        message: 'Wallet connection closed',
        data: {

        }
    },
    WALLET_TRANSACTION_SUCCESS: {
        status: true,
        code: 250613,
        message: 'wallet account changed',
        data: {

        }
    },
    WALLET_TRANSACTION_FAILE: {
        status: false,
        code: 250614,
        message: 'wallet account changed',
        data: {

        }
    },
}

interface Data {
}

export interface CustomResponse {
    status: boolean;
    code: number;
    message: string;
    data: Data | undefined | any;
}

export const ETHEREUM_METHODS = {
    REQUEST_ACCOUNTS : { method : 'eth_requestAccounts' },
    REQUEST_ETH_ACCOUNT : { method: 'eth_accounts' },
    REQUEST_CHAINID : { method: 'eth_chainId' },
    REQUEST_CHANGE_CHAIN : 'wallet_switchEthereumChain',
    REQUEST_WALLET_WATCH_ASSET : 'wallet_watchAsset'
}
export const META_MASK_EVENTS = {
    ACCOUNT_CHANGED : 'accountsChanged',
    CHAIN_CHANGED : 'chainChanged',
    CLOSE : 'disconnect'
}
  
export const CHAIN_ID = {
    ETH_MAINNET : '0x1',
    ROPSTEN : '0x3',
    RINKEBY : '0x4',
    BSC_MAINNET : '0x38',
    BSC_TESTNET : '0x61'
}