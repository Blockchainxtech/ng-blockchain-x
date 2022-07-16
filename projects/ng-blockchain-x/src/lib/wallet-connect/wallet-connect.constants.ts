
export const ERRORS = {
    METAMASK_NOT_INSTALLED: {
        status: false,
        code: 250511,
        message: 'Wallet not installed on browser',
        data: {

        }
    },
    METAMASK_NOT_CONNECTED: {
        status: false,
        code: 250512,
        message: 'Wallet not connected',
        data: {

        }
    },
    UNHANDLED_ERROR: {
        status: false,
        code: 250500,
        message: 'Un expected error',
        data: {

        }
    },
}

export const RESPONSE = {
    METAMASK_CONNECTED: {
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
    ACCOUNT_CHANGED: {
        status: true,
        code: 250611,
        message: 'account changed',
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
}

export const ETHEREUM_METHODS = {
    REQUEST_ACCOUNTS: { method: 'eth_requestAccounts' },
    REQUEST_ETH_ACCOUNT: { method: 'eth_accounts' },
    REQUEST_CHAINID: { method: 'eth_chainId' },
    REQUEST_CHANGE_CHAIN: 'wallet_switchEthereumChain',
    REQUEST_WALLET_WATCH_ASSET: 'wallet_watchAsset'
}
export const WALLET_CONNECT_EVENTS = {
    ACCOUNT_CHANGED: 'accountsChanged',
    CHAIN_CHANGED: 'chainChanged',
    CLOSE: 'disconnect'
}

export const CHAIN_ID = {
    ETH_MAINNET: '0x1',
    ROPSTEN: '0x3',
    RINKEBY: '0x4',
    BSC_MAINNET: '0x38',
    BSC_TESTNET: '0x61'
}