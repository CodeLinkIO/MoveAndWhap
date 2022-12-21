// This is a custom connector for the Sequence Wallet
// See https://github.com/0xsequence/web3-react-v6-connector/blob/master/packages/sequence-connector/src/index.ts

import { Connector, ConnectorEvent } from "@usedapp/core";
import { sequence } from "0xsequence";

function parseChainId(chainId) {
  if (typeof chainId === "number") {
    return chainId;
  }
  return Number.parseInt(chainId, 16);
}

class SequenceWalletConnector implements Connector {
  provider = null;
  sequenceWallet = null;
  name = "Sequence Wallet";
  update = new ConnectorEvent();

  constructor({ chainId, appName }) {
    this.chainId = chainId;
    this.appName = appName || "app";

    sequence.initWallet(this.chainId);
    const wallet = sequence.getWallet();
    this.sequenceWallet = wallet;
  }

  connectEagerly = async () => {
    this.activate();
  };

  activate = async () => {
    if (!this.sequenceWallet.isConnected()) {
      const connectDetails = await this.sequenceWallet.connect({
        app: "Move and Whap",
        // Setting authorize to true does not work on this class.
        // The sequence wallet auto close and throw errors
        // The only valid case is when the user have not login to Sequence Wallet
        // Move this logic to the WalletConnect component works fine with authorize: true
        // still investigating
        // authorize: true,
      });

      if (!connectDetails.connected) {
        console.error("Failed to connect");
        throw new Error("Failed to connect");
      }
    }

    if (this.sequenceWallet.isConnected()) {
      const provider = this.sequenceWallet.getProvider();
      this.provider = provider;

      const accounts = await this.getAccounts();

      this.update.emit({ chainId: parseChainId(this.chainId), accounts });
    }
  };

  getProvider = () => {
    return this.provider;
  };

  getChainId = () => {
    return this.chainId;
  };

  getWalletChainId = async () => {
    const walletChainId = await this.sequenceWallet.getChainId();
    return parseChainId(walletChainId);
  };

  getSigner = async () => {
    return this.sequenceWallet.getSigner();
  };

  async getAccounts() {
    return this.provider.request({ method: "eth_accounts" });
  }

  async deactivate(): Promise<void> {
    this.provider = undefined;
    this.sequenceWallet.disconnect();
  }
}

export default SequenceWalletConnector;
