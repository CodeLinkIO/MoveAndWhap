import { BigNumber } from "ethers";

import {
  BOAT_CONTAINER_HEIGHT,
  BOAT_CONTAINER_WIDTH,
  VIEWPORT_PADDING,
} from "../constants/pixi";

// Haft of the max value of uint256
const HALF_MAX_INT =
  "57896044618658097711785492504343953926634992332820282019728792003956564819968";

export const convertBigNumbersToCoordinate = (bigNumberX, bigNumberY) => {
  let biggest = BigNumber.from(HALF_MAX_INT);
  let xNorm = biggest.sub(bigNumberX);
  let yNorm = biggest.sub(bigNumberY);
  return { x: parseInt(xNorm.toString()), y: parseInt(yNorm.toString()) };
};

export const convertPlayerPositionToGameCoordinate = (boatPosition) => {
  const { x, y } = boatPosition;
  return {
    x: x * BOAT_CONTAINER_WIDTH + VIEWPORT_PADDING,
    y: y * BOAT_CONTAINER_HEIGHT + VIEWPORT_PADDING,
  };
};

export const convertGameCoordinateToPlayerPosition = (gameCoordinate) => {
  const { x, y } = gameCoordinate;
  return {
    x: Math.floor((x - VIEWPORT_PADDING) / BOAT_CONTAINER_WIDTH),
    y: Math.floor((y - VIEWPORT_PADDING) / BOAT_CONTAINER_HEIGHT),
  };
};
