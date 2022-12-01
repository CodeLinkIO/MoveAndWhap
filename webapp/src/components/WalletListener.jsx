import { useEffect } from "react";
import { useEthers } from "@usedapp/core";
import { Chain } from "../providers/walletProvider";
import {
  removeCurrentPlayerWalletAddress,
  storeCurrentPlayerWalletAddress,
} from "../utils/storage";

const SwitchNetwork = ({ children }) => {
  const { account, switchNetwork, chainId, active, isLoading } = useEthers();

  useEffect(() => {
    const switchToCorrectChain = async () => {
      const isAppReady = active && !isLoading && account && chainId;
      if (isAppReady && chainId !== Chain.chainId) {
        await switchNetwork(Chain.chainId);
      }
    };

    switchToCorrectChain();
  }, [account, chainId, switchNetwork, active, isLoading]);

  useEffect(() => {
    if (!account) {
      removeCurrentPlayerWalletAddress();
      return;
    }

    storeCurrentPlayerWalletAddress(account);
  }, [account]);

  return null;
};

export default SwitchNetwork;
