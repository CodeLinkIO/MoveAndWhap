export const GAME_SCREEN_WIDTH = window.outerWidth;
export const GAME_SCREEN_HEIGHT = window.outerHeight;

export const BOAT_CONTAINER_PADDING_FROM_BOAT = 1; // top bottom left right
// Boat
export const BOAT_WIDTH = 98;
export const BOAT_HEIGHT = BOAT_WIDTH;

// Container for boat and arrow, and name
export const BOAT_CONTAINER_WIDTH =
  BOAT_WIDTH + BOAT_CONTAINER_PADDING_FROM_BOAT * 2; // + left + right
export const BOAT_CONTAINER_HEIGHT =
  BOAT_HEIGHT + BOAT_CONTAINER_PADDING_FROM_BOAT * 2; // + top + bottom

export const BOAT_INIT_X = BOAT_CONTAINER_WIDTH / 2; // center x with container
export const BOAT_INIT_Y = BOAT_CONTAINER_HEIGHT / 2; // center y with container
export const BOAT_SIZE_AND_POSITION = {
  x: BOAT_INIT_X,
  y: BOAT_INIT_Y,
  width: BOAT_WIDTH,
  height: BOAT_HEIGHT,
};

export const MAX_COORDINATE = 255;
export const VIEWPORT_WOLD_WIDTH = MAX_COORDINATE * BOAT_CONTAINER_WIDTH;
export const VIEWPORT_WOLD_HEIGHT = MAX_COORDINATE * BOAT_CONTAINER_HEIGHT;
export const VIEWPORT_PADDING = 200;

// Arrows
export const ARROW_HEIGHT = 15;
const POINT_A = BOAT_CONTAINER_WIDTH / 2 - 10; // Left bottom point (x or y offset will depend on the arrow direction)
const POINT_B = BOAT_CONTAINER_WIDTH / 2 + 10; // Right bottom point
const POINT_C = BOAT_CONTAINER_WIDTH / 2; // Top point
export const DOWN_ARROW_PATH = [
  POINT_A,
  BOAT_CONTAINER_HEIGHT,
  POINT_B,
  BOAT_CONTAINER_HEIGHT,
  POINT_C,
  BOAT_CONTAINER_HEIGHT + ARROW_HEIGHT,
];

export const UP_ARROW_PATH = [POINT_A, 0, POINT_B, 0, POINT_C, -ARROW_HEIGHT];

export const LEFT_ARROW_PATH = [0, POINT_A, 0, POINT_B, -ARROW_HEIGHT, POINT_C];

export const RIGHT_ARROW_PATH = [
  BOAT_CONTAINER_WIDTH,
  POINT_A,
  BOAT_CONTAINER_WIDTH,
  POINT_B,
  ARROW_HEIGHT + BOAT_CONTAINER_WIDTH,
  POINT_C,
];

// Events
export const START_MOVING_EVENT = "startMoving";
export const STOP_MOVING_EVENT = "stopMoving";
export const START_FIRING_EVENT = "startFiring";
export const STOP_FIRING_EVENT = "stopFiring";

// Arrow direction
export const UP_DIRECTION = "up";
export const DOWN_DIRECTION = "down";
export const LEFT_DIRECTION = "left";
export const RIGHT_DIRECTION = "right";

export const DIRECTIONS = [
  UP_DIRECTION,
  RIGHT_DIRECTION,
  DOWN_DIRECTION,
  LEFT_DIRECTION,
];

export const BOUNCE_DISTANCE = 3;
export const BOUNCE_POSITION_BY_DIRECTION = {
  [UP_DIRECTION]: {
    x: 0,
    y: -BOUNCE_DISTANCE,
  },
  [DOWN_DIRECTION]: {
    x: 0,
    y: BOUNCE_DISTANCE,
  },

  [LEFT_DIRECTION]: {
    x: -BOUNCE_DISTANCE,
    y: 0,
  },
  [RIGHT_DIRECTION]: {
    x: BOUNCE_DISTANCE,
    y: 0,
  },
};

export const ACCEPTED_HEAD_FOR_HORIZON = [LEFT_DIRECTION, RIGHT_DIRECTION];
export const ACCEPTED_HEAD_FOR_VERTICAL = [UP_DIRECTION, DOWN_DIRECTION];

export const CENTER_POSITION = 14;
export const DISTANCE_FROM_CENTER = 2;
