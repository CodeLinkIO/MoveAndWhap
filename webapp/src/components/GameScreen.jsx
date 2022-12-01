import { memo, useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { useEthers } from "@usedapp/core";
import pixiApp from "../pixis/app";
import Boat from "../pixis/boat";
import { useNavigate } from "react-router-dom";
import {
  BOAT_CONTAINER_HEIGHT,
  BOAT_CONTAINER_WIDTH,
  GAME_SCREEN_HEIGHT,
  GAME_SCREEN_WIDTH,
  VIEWPORT_PADDING,
  VIEWPORT_WOLD_HEIGHT,
  VIEWPORT_WOLD_WIDTH,
} from "../constants/pixi";
import TileMap from "../pixis/tileMap";
import AppViewport from "../pixis/appViewport";
import { findBoatByAddress } from "../utils/contract";
import { HOME } from "../constants/routes";
import { convertPlayerPositionToGameCoordinate } from "../utils/numbers";
import { CONTRACT_DIRECTION } from "../constants/contracts";

const GameScreen = () => {
  const ref = useRef(null);
  // This always returns string because we have already check for undefined on parent component
  const { account } = useEthers();
  const navigate = useNavigate();

  useEffect(() => {
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

    const addBoatToScreen = ({ playerPosition, address, directionNum }) => {
      const { x, y } = playerPosition;
      const headDirection = CONTRACT_DIRECTION[directionNum];

      const boat = new Boat({
        boatContainerOptions: {
          x,
          y,
          width: BOAT_CONTAINER_WIDTH,
          height: BOAT_CONTAINER_HEIGHT,
        },
        address,
        isCurrentPlayer: address === account,
        headDirection,
      });
      return boat;
    };

    const initGameScreen = async () => {
      const currentPlayer = await findBoatByAddress(account);
      if (!currentPlayer || !currentPlayer.isAlive) {
        navigate(HOME, { replace: true });
      }

      const currentPlayerPosition = convertPlayerPositionToGameCoordinate({
        x: currentPlayer.x,
        y: currentPlayer.y,
      });

      viewport.moveCenter(currentPlayerPosition.x, currentPlayerPosition.y);
      viewport.setupViewportInteraction();
      // create background
      TileMap.initialize(currentPlayerPosition);

      // create boats

      addBoatToScreen({
        playerPosition: {
          x: currentPlayerPosition.x,
          y: currentPlayerPosition.y + 100,
        },
        address: `account1`,
        directionNum: 2,
      });

      addBoatToScreen({
        playerPosition: {
          x: currentPlayerPosition.x - 100,
          y: currentPlayerPosition.y,
        },
        address: `account2`,
        directionNum: 0,
      });

      addBoatToScreen({
        playerPosition: {
          x: currentPlayerPosition.x + 100,
          y: currentPlayerPosition.y,
        },
        address: `account2`,
        directionNum: 0,
      });

      addBoatToScreen({
        playerPosition: {
          x: currentPlayerPosition.x,
          y: currentPlayerPosition.y + 300,
        },
        address: `account3`,
        directionNum: 0,
      });

      addBoatToScreen({
        playerPosition: {
          x: currentPlayerPosition.x + 200,
          y: currentPlayerPosition.y + 200,
        },
        address: `account4`,
        directionNum: 0,
      });

      // Player boat will always be created last in the list
      const currentPlayerBoat = addBoatToScreen({
        playerPosition: currentPlayerPosition,
        address: account,
        directionNum: currentPlayer.directionNum,
      });
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

  return <div ref={ref} />;
};

export default memo(GameScreen);
