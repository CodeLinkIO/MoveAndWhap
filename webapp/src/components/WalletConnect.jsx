import { useState } from "react";
import { useEthers } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import { random } from "lodash";
import { Chain, connectorType } from "../providers/walletProvider";
import { findBoatByAddress, join, whap } from "../utils/contract";
import { GAME_SCREEN } from "../constants/routes";
import { CENTER_POSITION, DISTANCE_FROM_CENTER } from "../constants/pixi";

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

  const kill = async () => {
    setJoining(true);
    await whap(account);
    setJoining(false);
  };

  if (!active || isLoading || joining) {
    return <div>Loading</div>;
  }

  if (active && !isLoading && !account) {
    return (
      <div className="flex justify-center flex-col items-center">
        <h1 className="text-2xl">Move and Whap</h1>
        <h2 className="text-xl mb-2 mt-2">Connect and Join our battle</h2>
        <button
          className="flex p-2 mb-2 bg-gray-400 justify-center"
          onClick={onConnect}
        >
          Connect
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col items-center">
      <h1 className="text-2xl">Move and Whap</h1>
      <h2 className="text-xl">Welcome player {account}</h2>
      <h2 className="text-xl">How to play</h2>
      <p>
        price acres finish universe defines nation solely closing centers
        freight arranged movement hardwood coaches coding turkish magical
        shorter extra register causes nancy bahrain exposure cartoons skiing
        loops diploma travis sharon aviation imaging zambia richard forming
        montreal billion trout upper position prefers salaries coverage fresh
        marking propecia players romania istanbul killed thong eternal sodium
        acrobat width worst finally poison picks tickets bottles fraser menus
        labor easier europe bryan floor lucky consider oakland crawford betty
        activity poker chicago evident borough friend closure accent session
        webpage morning passport athletes wings chambers dying offshore treasure
        pressure merely indiana colors gambling regular
      </p>

      <div className="flex flex-col w-[500px]">
        <button
          onClick={joinTheGame}
          className="flex p-2 mb-2 bg-gray-400 justify-center"
        >
          Take me to the game
        </button>
        <button
          onClick={kill}
          className="flex p-2 mb-2 bg-gray-400 justify-center"
        >
          Kill
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;
