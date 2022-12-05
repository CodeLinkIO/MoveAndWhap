import {
  BOAT_CONTAINER_HEIGHT,
  BOAT_CONTAINER_WIDTH,
  VIEWPORT_PADDING,
} from "../constants/pixi";

export const convertBigNumbersToCoordinate = (bigNumberX, bigNumberY) => {
  return {
    x: parseInt(bigNumberX.toString()),
    y: parseInt(bigNumberY.toString()),
  };
};

export const convertPlayerPositionToGameCoordinate = (boatPosition) => {
  const { x, y } = boatPosition;
  return {
    x: x * BOAT_CONTAINER_WIDTH + VIEWPORT_PADDING,
    y: y * BOAT_CONTAINER_HEIGHT + VIEWPORT_PADDING,
  };
};
