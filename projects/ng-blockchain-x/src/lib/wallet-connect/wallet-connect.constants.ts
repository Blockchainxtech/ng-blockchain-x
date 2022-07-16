export const WALLET_CONNECT_EVENTS = {
    CONNECT : 'connect',
    SESSION_UPDATE: 'session_update',
    DISCONNECT: 'disconnect'
}

export const WALLET_CONNECT_URI = 'https://bridge.walletconnect.org';

export const RESPONSE = {
    WALLET_CONNECT_DISCONNECTED: {
        status : true,
        code : 250700,
        message : 'Wallet connect disconnected successfully',
        data : {
          
        }
    },
    WALLET_CONNECT_CONNECTED : {
        status : true,
        code : 250601,
        message : 'Metamask connected successfully',
        data : {
          
        }
    },
    SERVICE_INITIALIZED : {
        status : true,
        code : 250609,
        message : 'Service init success',
        data : {
          
        }
    },
    CHAIN_CHANGED : {
        status : true,
        code : 250610,
        message : 'chain changed',
        data : {
          
        }
    },
    WALLET_CONNECT_CHANGED : {
        status : true,
        code : 250611,
        message : 'wallet connect account changed',
        data : {
          
        }
    },
    CONNECTION_CLOSED : {
        status : true,
        code : 250612,
        message : 'metamask connection closed',
        data : {
          
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
