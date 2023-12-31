import {createPublicClient, createWalletClient, Hex, http, PrivateKeyAccount, WalletClient} from 'viem';
import {fantom, fantomTestnet, hardhat} from 'viem/chains';
import {privateKeyToAccount} from 'viem/accounts';


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

const HEROICUS_ADDRESSES: { [key: string]: `0x${string}` } = {
  hardhat: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  'fantom-testnet': '0x0b0d47cf4839F118D19E4AB65ddFdDdD93E824Fc',
  fantom: '0xC6537b534dEe49ff94A3193A65101f367c1C566A',
  'milkomeda_t':'0xdfE51561adacdE663fBA63Fbf952A3996F81d1DA'
};

const USDC_ADDRESSES: { [key: string]: `0x${string}` } = {
  hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  'fantom-testnet': '0xB537afeA2B022111e677E26AD4190C546C65CccD',
  fantom: '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf',
  'milkomeda_t': '0xb40E51f657EFa934D43A05cd4cC9f0a11faA05d0'
};
export const CURRENT_CHAIN = CHAINS[process.env.NEXT_PUBLIC_CHAIN as string];
export const CloudXAddress = HEROICUS_ADDRESSES[process.env.NEXT_PUBLIC_CHAIN as string];
export const USDCAddress = USDC_ADDRESSES[process.env.NEXT_PUBLIC_CHAIN as string];

export const createViemClient = () => {
  return createPublicClient({
    chain: CURRENT_CHAIN,
    transport: http(),
  });
};

export const getOwnerAccount = (): PrivateKeyAccount => {
  return privateKeyToAccount(process.env.OWNER_PRIVATE_KEY as Hex);
};

export const createViemWallet = (): WalletClient => {
  return createWalletClient({
    account: getOwnerAccount(),
    chain: CURRENT_CHAIN,
    transport: http(),
  });
};
