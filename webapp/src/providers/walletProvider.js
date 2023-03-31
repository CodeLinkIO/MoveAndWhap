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

export const LocalMawSubnet = {
  chainId: parseInt(process.env.REACT_APP_SUBNET_CHAIN_ID) || "NOT_SUPPORTED",
  chainName: "MAW Subnet",
  isTestChain: true,
  isLocalChain: true,
  nativeCurrency: {
    name: "MAW",
    symbol: "MAW",
    decimals: 18,
  },
  multicallAddress: "0x0000000000000000000000000000000000000000",
  rpcUrls: process.env.REACT_APP_SUBNET_RPC_URLS || "NOT_SUPPORTED",
  blockExplorerUrls: FUJI_BLOCK_EXPLORER,
  getExplorerAddressLink: (address) =>
    `${FUJI_BLOCK_EXPLORER}/address/${address}`,
  getExplorerTransactionLink: (transactionHash) =>
    `${FUJI_BLOCK_EXPLORER}/tx/${transactionHash}`,
};

export const FujiMawSubnet = {
  chainId: parseInt(process.env.REACT_APP_SUBNET_CHAIN_ID) || "NOT_SUPPORTED",
  chainName: "MAW Subnet",
  isTestChain: true,
  isLocalChain: false,
  nativeCurrency: {
    name: "MAW",
    symbol: "MAW",
    decimals: 18,
  },
  multicallAddress: "0x0000000000000000000000000000000000000000",
  rpcUrls: process.env.REACT_APP_SUBNET_RPC_URLS || "NOT_SUPPORTED",
  blockExplorerUrls: FUJI_BLOCK_EXPLORER,
  getExplorerAddressLink: (address) =>
    `${FUJI_BLOCK_EXPLORER}/address/${address}`,
  getExplorerTransactionLink: (transactionHash) =>
    `${FUJI_BLOCK_EXPLORER}/tx/${transactionHash}`,
};

const CHAIN_LIST = {
  [Fuji.chainId]: Fuji,
  [Hardhat.chainId]: Hardhat,
  [LocalMawSubnet.chainId]: LocalMawSubnet,
  [FujiMawSubnet.chainId]: FujiMawSubnet,
};

export const sequenceConnector = new SequenceConnector({
  chainId: Fuji.chainId,
  appName: "Move and Whap",
});

export const Chain =
  CHAIN_LIST[parseInt(process.env.REACT_APP_CHAIN_ID)] ||
  CHAIN_LIST[FujiMawSubnet.chainId];

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

const localMawSubnetWalletProviderConfig = {
  readOnlyChainId: LocalMawSubnet.chainId,
  readOnlyUrls: {
    [LocalMawSubnet.chainId]: LocalMawSubnet.rpcUrls,
  },
  networks: [LocalMawSubnet],
};

const fujiMawSubnetWalletProviderConfig = {
  readOnlyChainId: FujiMawSubnet.chainId,
  readOnlyUrls: {
    [FujiMawSubnet.chainId]: FujiMawSubnet.rpcUrls,
  },
  networks: [FujiMawSubnet],
};

const WalletConfigList = {
  [Fuji.chainId]: FujiWalletProviderConfig,
  [Hardhat.chainId]: localhostWalletProviderConfig,
  [FujiMawSubnet.chainId]: fujiMawSubnetWalletProviderConfig,
  [LocalMawSubnet.chainId]: localMawSubnetWalletProviderConfig,
};

const WalletProviderConfig =
  WalletConfigList[Chain.chainId] || localhostWalletProviderConfig;

const WalletProvider = ({ children }) => {
  return <DAppProvider config={WalletProviderConfig}>{children}</DAppProvider>;
};

export default WalletProvider;
