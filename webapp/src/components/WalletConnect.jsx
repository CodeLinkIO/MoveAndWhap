import { useState } from "react";
import { useEthers } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import { random } from "lodash";
import { Chain, connectorType } from "../providers/walletProvider";
import { findBoatByAddress, join } from "../utils/contract";
import { GAME_SCREEN } from "../constants/routes";
import { CENTER_POSITION, DISTANCE_FROM_CENTER } from "../constants/pixi";
import Background from "./Background";
import { contractAddressTruncate } from "../utils/string";
import HowToPlay from "./HowToPlay";
import LoadingScreen from "./LoadingScreen";
import Button from "./Button";

const MIN_INIT_POSITION = CENTER_POSITION - DISTANCE_FROM_CENTER;
const MAX_INIT_POSITION = CENTER_POSITION + DISTANCE_FROM_CENTER;

const WalletConnect = () => {
  const [joining, setJoining] = useState(false);
  const {
    activateBrowserWallet,
    account,
    active,
    isLoading,
    switchNetwork,
    chainId,
  } = useEthers();

  const navigate = useNavigate();

  const onConnect = async () => {
    await activateBrowserWallet({ type: connectorType });
    if (chainId !== Chain.chainId) {
      await switchNetwork(Chain.chainId);
    }
  };

  const joinTheGame = async () => {
    setJoining(true);

    const boat = await findBoatByAddress(account);
    if (!boat || !boat.isAlive) {
      const positionUint8X = random(MIN_INIT_POSITION, MAX_INIT_POSITION);
      const positionUint8Y = random(MIN_INIT_POSITION, MAX_INIT_POSITION);
      await join(positionUint8X, positionUint8Y);
    }

    navigate(GAME_SCREEN, {
      replace: true,
    });
  };

  if (!active || isLoading || joining) {
    return <LoadingScreen />;
  }

  const isNotConnected = !active || isLoading || !account;

  return (
    <Background>
      <div className="flex justify-center flex-col items-center w-full min-w-full">
        <h1 className="font-game text-white drop-shadow-game-title text-[80px] mt-10 mb-10">
          MOVE & WHAP
        </h1>
        <div className="flex justify-center items-center flex-col mb-10">
          <h2 className="text-sm drop-shadow-game-title mb-2">
            A simple game where you move and whap!
          </h2>
          {account && (
            <h2 className="text-sm drop-shadow-game-title">
              Welcome player{" "}
              <span className=" text-green-400">
                {contractAddressTruncate(account)}
              </span>
            </h2>
          )}
        </div>

        <div className="flex flex-col">
          {isNotConnected ? (
            <Button onClick={onConnect}>Connect</Button>
          ) : (
            <Button onClick={joinTheGame}>Play Now</Button>
          )}
        </div>

        <HowToPlay />
      </div>
    </Background>
  );
};

export default WalletConnect;
