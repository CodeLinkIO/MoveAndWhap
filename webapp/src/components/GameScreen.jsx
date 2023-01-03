import { memo, useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { useEthers } from "@usedapp/core";
import { useSocketIO } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import pixiApp from "../pixis/app";
import {
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_WIDTH,
  VIEWPORT_PADDING,
  VIEWPORT_WOLD_HEIGHT,
  VIEWPORT_WOLD_WIDTH,
} from "../constants/pixi";
import TileMap from "../pixis/tileMap";
import AppViewport from "../pixis/appViewport";
import {
  findBoatByAddress,
  getCurrentPlayerCoordinates,
} from "../utils/contract";
import { HOME } from "../constants/routes";
import { getPlayersInRange, onWsMessage, onWsOpen } from "../pixis/ws";
import { WS_READY_STATE } from "../constants/webSockets";
import LoadingScreen from "./LoadingScreen";

const GameScreen = () => {
  const ref = useRef(null);
  // This always returns string because we have already check for undefined on parent component
  const { account } = useEthers();
  const navigate = useNavigate();
  const { readyState, getWebSocket } = useSocketIO(
    process.env.REACT_APP_WS_URL,
    {
      onMessage: onWsMessage,
      onOpen: onWsOpen,
    }
  );

  useEffect(() => {
    if (!account) return;

    // On first render create application
    const app = new Application({
      width: GAME_SCREEN_WIDTH,
      height: GAME_SCREEN_HEIGHT,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    pixiApp.setApp(app);
    // Add app to DOM
    ref.current.appendChild(app.view);

    const viewport = new AppViewport({
      screenWidth: GAME_SCREEN_WIDTH,
      screenHeight: GAME_SCREEN_HEIGHT,
      worldWidth: VIEWPORT_WOLD_WIDTH + VIEWPORT_PADDING,
      worldHeight: VIEWPORT_WOLD_HEIGHT + VIEWPORT_PADDING,
      interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    const initGameScreen = async () => {
      const currentPlayerPosition = await getCurrentPlayerCoordinates(account);
      if (!currentPlayerPosition) {
        navigate(HOME, { replace: true });
      }

      TileMap.initialize(currentPlayerPosition);
      currentPlayerPosition &&
        viewport.moveCenter(currentPlayerPosition.x, currentPlayerPosition.y);

      viewport.setupViewportInteraction();
    };

    initGameScreen();

    return () => {
      console.log("Unmounting");
      // On unload completely destroy the application and all of it's children
      app.destroy(true, false);
    };
  }, [account, navigate]);

  useEffect(() => {
    pixiApp.setWalletAddress(account);
  }, [account]);

  useEffect(() => {
    if (readyState === WS_READY_STATE.OPEN && account) {
      const ws = getWebSocket();
      pixiApp.setSocket(ws);

      const getPlayers = async () => {
        const currentPlayer = await findBoatByAddress(account);
        if (!currentPlayer || !currentPlayer.isAlive) {
          return;
        }

        getPlayersInRange({
          x: currentPlayer.x,
          y: currentPlayer.y,
          range: 128,
        });
      };

      getPlayers();
    }

    return () => {
      pixiApp.setSocket(null);
    };
  }, [readyState, getWebSocket, account, navigate]);

  const isLoading = !account || readyState !== WS_READY_STATE.OPEN;

  return (
    <>
      <LoadingScreen className={isLoading ? `` : `hidden`} />
      <div ref={ref} className={isLoading ? `invisible` : ``} />
    </>
  );
};

export default memo(GameScreen);
