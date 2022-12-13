import { Sprite, Ticker } from "pixi.js";
import {
  DOWN_DIRECTION,
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
  START_MOVING_EVENT,
  UP_DIRECTION,
  DIRECTIONS,
  BOAT_CONTAINER_WIDTH,
  BOAT_CONTAINER_HEIGHT,
  STOP_MOVING_EVENT,
  BOUNCE_POSITION_BY_DIRECTION,
  START_FIRING_EVENT,
  STOP_FIRING_EVENT,
  ENEMY_STOP_MOVING_EVENT,
  ENEMY_STOP_FIRING_EVENT,
} from "../constants/pixi";
import pixiApp from "./app";
import FireIcon from "../assets/fire.png";
import PositionMapper from "./positionMapper";
import { Group, Tween } from "tweedle.js";

const FIRE_WIDTH = 50;
const FIRE_HEIGHT = 50;
const FIRE_IMAGE_DIRECTION = RIGHT_DIRECTION;

const GET_FIREABLE_BOAT = {
  [UP_DIRECTION]: PositionMapper.getFireableBoatOnTop,
  [RIGHT_DIRECTION]: PositionMapper.getFireableBoatOnRight,
  [DOWN_DIRECTION]: PositionMapper.getFireableBoatOnBottom,
  [LEFT_DIRECTION]: PositionMapper.getFireableBoatOnLeft,
};

class FireButton {
  isMoving = false;
  viewport = null;
  direction = DOWN_DIRECTION;
  fireButton = null;
  bouncingAnimation = null;
  fireableBoat = null;

  constructor({ onClick, direction, container, controller }) {
    this.container = container;
    this.direction = direction;
    this.viewport = pixiApp.getViewport();

    this.fireButton = Sprite.from(FireIcon);
    this.fireButton.on("pointertap", async () => this.onFireTriggered(onClick));
    this.fireButton.cursor = "pointer";
    this.fireButton.anchor.set(0.5);
    this.fireButton.width = FIRE_WIDTH;
    this.fireButton.height = FIRE_HEIGHT;
    this.setupFireButtonPositionByDirection();
    setTimeout(() => this.checkForFireButtonVisibility(), 0);
    this.setupBouncingAnimation();

    this.fireButton.on(START_MOVING_EVENT, this.onStartMoving);
    this.fireButton.on(STOP_MOVING_EVENT, this.onStopMoving);

    this.fireButton.on(START_FIRING_EVENT, this.onStartFiring);
    this.fireButton.on(STOP_FIRING_EVENT, this.onStopFiring);

    this.fireButton.on(ENEMY_STOP_MOVING_EVENT, this.onEnemyStopMoving);
    this.fireButton.on(ENEMY_STOP_FIRING_EVENT, this.onEnemyStartFiring);
  }

  onFireTriggered = async (onClick) => {
    if (!this.fireableBoat) return;
    await onClick(this.fireableBoat.address);
  };

  setupFireButtonPositionByDirection = () => {
    let x = 0;
    let y = 0;
    const halfX = BOAT_CONTAINER_WIDTH / 2;
    const halfY = BOAT_CONTAINER_HEIGHT / 2;

    switch (this.direction) {
      case UP_DIRECTION:
        x = halfX - 2;
        y = 15;
        break;

      case DOWN_DIRECTION:
        x = halfX + 2;
        y = BOAT_CONTAINER_HEIGHT - 15;
        break;

      case LEFT_DIRECTION:
        x = 0;
        y = halfY + 2;
        break;

      case RIGHT_DIRECTION:
        x = BOAT_CONTAINER_WIDTH;
        y = halfY - 2;
        break;
      default:
        break;
    }

    this.fireButton.x = x;
    this.fireButton.y = y;
    const degree = this.calculateRotationDegree();
    this.fireButton.angle = degree;
  };

  getFireButton() {
    return this.fireButton;
  }

  setupBouncingAnimation = () => {
    Ticker.shared.add(() => {
      Group.shared.update();
    });

    this.bouncingAnimation = new Tween(this.fireButton);
    const bouncePosition = BOUNCE_POSITION_BY_DIRECTION[this.direction];
    const x = this.fireButton.x + bouncePosition.x;
    const y = this.fireButton.y + bouncePosition.y;
    this.bouncingAnimation
      .to({ x, y }, 400, "easeOutQuad")
      .yoyo(true)
      .repeat(Infinity)
      .start();
  };

  onStartMoving = () => {
    this.fireButton.cursor = "default";
    this.fireButton.visible = false;
  };

  onStopMoving = () => {
    this.checkForFireButtonVisibility();
  };

  toWorldPosition = (position) => {
    return this.viewport.toWorld(position);
  };

  calculateRotationDegree = () => {
    const headDirectionIndex = DIRECTIONS.indexOf(this.direction);
    const initDirectionIndex = DIRECTIONS.indexOf(FIRE_IMAGE_DIRECTION);
    const rotationDegree = (headDirectionIndex - initDirectionIndex) * 90;
    const currentAngle = this.fireButton.angle;
    const degree = currentAngle + rotationDegree;
    return degree;
  };

  checkForFireButtonVisibility = () => {
    const getFireableBoat = GET_FIREABLE_BOAT[this.direction];
    this.fireableBoat = getFireableBoat(this.container);
    if (!this.fireableBoat) {
      this.fireButton.cursor = "default";
      this.fireButton.interactive = false;
      this.fireButton.visible = false;
      return;
    }
    this.fireButton.cursor = "pointer";
    this.fireButton.interactive = true;
    this.fireButton.visible = true;
  };

  onStartFiring = () => {
    this.fireButton.visible = false;
  };

  onStopFiring = () => {
    this.checkForFireButtonVisibility();
  };

  onEnemyStopMoving = () => {
    this.checkForFireButtonVisibility();
  };

  onEnemyStartFiring = () => {
    this.checkForFireButtonVisibility();
  };
}

export default FireButton;
