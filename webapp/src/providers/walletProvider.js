import { DAppProvider, Hardhat } from "@usedapp/core";

const FUJI_BLOCK_EXPLORER = "https://testnet.snowtrace.io";

export const Fuji = {
  chainId: 43113,
  chainName: "Avalanche Fuji C-Chain",
  isTestChain: true,
  isLocalChain: false,
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  multicallAddress: "0x0000000000000000000000000000000000000000",
  rpcUrls: "https://api.avax-test.network/ext/bc/C/rpc",
  blockExplorerUrls: FUJI_BLOCK_EXPLORER,
  getExplorerAddressLink: (address) =>
    `${FUJI_BLOCK_EXPLORER}/address/${address}`,
  getExplorerTransactionLink: (transactionHash) =>
    `FUJI_BLOCK_EXPLORER/tx/${transactionHash}`,
};

const CHAIN_LIST = {
  [Fuji.chainId]: Fuji,
  [Hardhat.chainId]: Hardhat,
};

export const Chain =
  CHAIN_LIST[parseInt(process.env.REACT_APP_CHAIN_ID)] ||
  CHAIN_LIST[Hardhat.chainId];

const FujiWalletProviderConfig = {
  readOnlyChainId: Fuji.chainId,
  readOnlyUrls: {
    [Fuji.chainId]:
      "https://patient-yolo-wave.avalanche-testnet.quiknode.pro/896a4076ea14a0f32ac6c99ff1488cec1672bb2b/ext/bc/C/rpc",
  },

  networks: [Fuji],
};

const localhostWalletProviderConfig = {
  readOnlyChainId: Hardhat.chainId,
  readOnlyUrls: {
    [Hardhat.chainId]: Hardhat.rpcUrl,
  },
};

const WalletConfigList = {
  [Fuji.chainId]: FujiWalletProviderConfig,
  [Hardhat.chainId]: localhostWalletProviderConfig,
};

const WalletProviderConfig =
  WalletConfigList[Chain.chainId] || localhostWalletProviderConfig;

const WalletProvider = ({ children }) => {
  return <DAppProvider config={WalletProviderConfig}>{children}</DAppProvider>;
};

export default WalletProvider;
