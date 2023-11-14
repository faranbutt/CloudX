import {createPublicClient, http} from 'viem';
import {fantom, fantomTestnet, hardhat} from 'viem/chains';
export const milkomedaTestnet = {
  id: 200202,
  name: 'Milkomeda Testnet',
  network: 'Milkomeda',
  nativeCurrency: {
    decimals: 18,
    name: 'Milkomeda',
    symbol: 'MTALGO',
  },
  rpcUrls: {
    public: { http: ['https://rpc-devnet-algorand-rollup.a1.milkomeda.com'] },
    default: { http: ['https://rpc-devnet-algorand-rollup.a1.milkomeda.com'] },
  },
  blockExplorers: {
    // etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    // default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  contracts: {
    // multicall3: {
    //   address: '0xca11bde05977b3631167028862be2a173976ca11',
    //   blockCreated: 11_907_934,
    // },
  },
}


const CHAINS: { [key: string]: any } = {
  'hardhat': hardhat,
  'fantom': fantom,
  'fantom-testnet': fantomTestnet,
  'milkomeda_t': milkomedaTestnet

};

 

const CLOUDX_ADDRESSES: { [key: string]: `0x${string}` } = {
  hardhat: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  'fantom-testnet': '0x0b0d47cf4839F118D19E4AB65ddFdDdD93E824Fc',
  fantom: '0xC6537b534dEe49ff94A3193A65101f367c1C566A',
  'milkomeda_t':'0xdfE51561adacdE663fBA63Fbf952A3996F81d1DA'
};

const CHAIN_ID = process.env.CHAIN as string;
export const CURRENT_CHAIN = CHAINS[CHAIN_ID];
export const CloudXAddress = CLOUDX_ADDRESSES[CHAIN_ID];
export const createViemClient = () => {
  return createPublicClient({
    chain: CURRENT_CHAIN,
    transport: http(),
  });
};
