

export const chainNames = [
    { '0x1' : 'ETH Mainnet' },
    { '0x38' : 'BSC Mainnet' },
    { '0x61' : 'BSC Testnet' },
    { '0x4' : 'Rinkeby ETH Testnet' },
    { '0x3' : 'Ropsten ETH Testnet' },
    { '0x3ec' : 'EKTA Testnet' },
    { '0x7ca' : 'EKTA Mainnet' },
]
export const supportedChains = [
    {
        chain_id: '0x61',
        name: 'BSC Testnet',
        add_network_params: {
            chainId: '0x61',
            chainName: 'BSC chain',
            rpcUrls: [
                'https://data-seed-prebsc-1-s1.binance.org:8545/'
            ],
            blockExplorerUrls: [
                'https://testnet.bscscan.com'
            ],
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            }
        }
    },
    {
        chain_id: '0x38',
        name: 'BSC Mainnet',
        add_network_params: {
            chainId: '0x38',
            chainName: 'BSC Mainnet',
            rpcUrls: [
                'https://https://bsc-dataseed.binance.org'
            ],
            blockExplorerUrls: [
                'https://bscscan.com'
            ],
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            }
        }
    }
];

export const chainInfo = (chainId: string) => {
    for (let i = 0; i < supportedChains.length; i++) {
        const chain = supportedChains[i];
        if (chainId == chain.chain_id) {
            return chain;
        }
    }
    return false;
}

export const getAddNetworkParam = (chainId: string) => {
    for (let i = 0; i < supportedChains.length; i++) {
        const chain = supportedChains[i];
        if (chainId == chain.chain_id) {
            return {
                method: 'wallet_addEthereumChain',
                params: [
                    chain.add_network_params
                ]
            }
        }
    }
    return false;
}
