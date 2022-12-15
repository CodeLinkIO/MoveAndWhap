import { DAppProvider, Hardhat, MetamaskConnector } from "@usedapp/core";
import SequenceConnector from "../connectors/sequenceConnector";
import { CONNECTOR_TYPE } from "../constants/contracts";

const FUJI_BLOCK_EXPLORER = "https://testnet.snowtrace.io";

export const connectorType =
  CONNECTOR_TYPE[process.env.REACT_APP_CONNECTOR_TYPE] ||
  CONNECTOR_TYPE.metamask;

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

export const sequenceConnector = new SequenceConnector({
  chainId: Fuji.chainId,
  appName: "Move and Whap",
});

export const Chain =
  CHAIN_LIST[parseInt(process.env.REACT_APP_CHAIN_ID)] ||
  CHAIN_LIST[Hardhat.chainId];

const FujiWalletProviderConfig = {
  readOnlyChainId: Fuji.chainId,
  readOnlyUrls: {
    [Fuji.chainId]: "https://api.avax-test.network/ext/bc/C/rpc",
  },

  networks: [Fuji],
  connectors: {
    metamask: new MetamaskConnector(),
    sequence: sequenceConnector,
  },
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
