import { Ticker } from "pixi.js";
import { Tween, Group } from "tweedle.js";
import {
  BOAT_CONTAINER_HEIGHT,
  BOAT_CONTAINER_WIDTH,
  DOWN_ARROW_PATH,
  LEFT_ARROW_PATH,
  RIGHT_ARROW_PATH,
  START_MOVING_EVENT,
  STOP_MOVING_EVENT,
  UP_ARROW_PATH,
  UP_DIRECTION,
  RIGHT_DIRECTION,
  DOWN_DIRECTION,
  LEFT_DIRECTION,
} from "../constants/pixi";
import { move } from "../utils/contract";
import Arrow from "./arrow";
import PositionMapper from "./positionMapper";

const MOVING_DISTANCE_Y = BOAT_CONTAINER_HEIGHT;
const MOVING_DISTANCE_X = BOAT_CONTAINER_WIDTH;
const MOVING_TIME = 1800; // ms
const ROTATING_TIME = 500; // ms

// Default head of the boat image
const IMAGE_HEAD = DOWN_DIRECTION;

const DIRECTIONS = [
  UP_DIRECTION,
  RIGHT_DIRECTION,
  DOWN_DIRECTION,
  LEFT_DIRECTION,
];

class BoatArrowsController {
  downArrow = null;
  upArrow = null;
  leftArrow = null;
  rightArrow = null;
  container = null;
  boat = null;
  movingTweeny = null;
  rotationTweeny = null;
  isMoving = false;
  headDirection = DOWN_DIRECTION;

  constructor({ container, onDownArrowClick = () => {}, headDirection }) {
    this.container = container;
    this.boat = this.container.getBoat();
    this.setupHeadDirection(headDirection);
    this.setupDownArrow();
    this.setupUpArrow();
    this.setupLeftArrow();
    this.setupRightArrow();
  }

  setupHeadDirection = (headDirection) => {
    this.headDirection = headDirection;
    const rotationDegree = this.calculateRotationDegree({
      headDirection: IMAGE_HEAD,
      targetDirection: headDirection,
    });
    this.boat.angle = rotationDegree;
  };

  setupDownArrow = () => {
    this.downArrow = new Arrow(
      DOWN_ARROW_PATH,
      this.moveBoatDown,
      DOWN_DIRECTION,
      this.container
    );
    this.container.addChild(this.downArrow.getArrow());
  };

  setupUpArrow = () => {
    this.upArrow = new Arrow(
      UP_ARROW_PATH,
      this.moveBoatUp,
      UP_DIRECTION,
      this.container
    );
    this.container.addChild(this.upArrow.getArrow());
  };

  setupLeftArrow = () => {
    this.leftArrow = new Arrow(
      LEFT_ARROW_PATH,
      this.moveBoatLeft,
      LEFT_DIRECTION,
      this.container
    );
    this.container.addChild(this.leftArrow.getArrow());
  };

  setupRightArrow = () => {
    this.rightArrow = new Arrow(
      RIGHT_ARROW_PATH,
      this.moveBoatRight,
      RIGHT_DIRECTION,
      this.container
    );
    this.container.addChild(this.rightArrow.getArrow());
  };

  getDownArrow = () => {
    return this.downArrow;
  };

  getUpArrow = () => {
    return this.upArrow;
  };

  getLeftArrow = () => {
    return this.leftArrow;
  };

  getRightArrow = () => {
    return this.rightArrow;
  };

  getHeadDirection = () => {
    return this.headDirection;
  };

  setHeadDirection = (headDirection) => {
    this.headDirection = headDirection;
  };

  emitEvent = (eventName) => {
    this.downArrow.getArrow().emit(eventName);
    this.upArrow.getArrow().emit(eventName);
    this.leftArrow.getArrow().emit(eventName);
    this.rightArrow.getArrow().emit(eventName);
  };

  setupBoatTweeny = (direction) => {
    Ticker.shared.add(() => {
      Group.shared.update();
    });

    const shouldRotate = this.shouldRotate({
      headDirection: this.headDirection,
      targetDirection: direction,
    });

    if (shouldRotate) {
      this.rotateTweeny = this.createRotationTweeny();
    }
    this.movingTweeny = this.createMoveTweeny();
  };

  createMoveTweeny = () => {
    const tweeny = new Tween(this.container.position);
    return tweeny;
  };

  createRotationTweeny = () => {
    const rotateTweeny = new Tween(this.boat);
    return rotateTweeny;
  };

  moveBoat = async (distance, direction) => {
    await move(direction);

    this.setupBoatTweeny(direction);

    const shouldRotate = this.shouldRotate({
      headDirection: this.headDirection,
      targetDirection: direction,
    });

    if (!shouldRotate) {
      this.moveWithoutRotation(distance);
      return;
    }

    this.moveWithRotation(distance, direction);
  };

  moveWithoutRotation = (distance) => {
    this.movingTweeny.onStart(async () => {
      this.onMoveStart();
    });
    this.movingTweeny.onComplete(() => {
      this.onMoveEnd(this.headDirection);
    });

    this.movingTweeny.to(distance, MOVING_TIME);
    this.movingTweeny.start();
  };

  onMoveStart = () => {
    this.emitEvent(START_MOVING_EVENT);
  };

  onMoveEnd = (direction) => {
    this.headDirection = direction;
    PositionMapper.setBoatMap(this);
    this.emitEvent(STOP_MOVING_EVENT);
  };

  moveWithRotation = (distance, direction) => {
    this.rotateTweeny.onStart(async () => {
      this.onMoveStart();
    });
    this.movingTweeny.onComplete(() => {
      this.onMoveEnd(direction);
    });

    const degree = this.calculateRotationDegree({
      headDirection: this.headDirection,
      targetDirection: direction,
    });
    this.rotateTweeny.to(
      {
        angle: degree,
      },
      ROTATING_TIME
    );
    this.movingTweeny.to(distance, MOVING_TIME);

    this.rotateTweeny?.chain(this.movingTweeny);
    this.rotateTweeny.start();
  };

  moveBoatDown = async (e) => {
    if (this.isMoving) {
      return;
    }
    const moveDownValue = MOVING_DISTANCE_Y + this.container.y;
    await this.moveBoat({ y: moveDownValue }, DOWN_DIRECTION);
  };

  shouldRotate = ({ headDirection, targetDirection }) => {
    return headDirection !== targetDirection;
  };

  moveBoatUp = async (e) => {
    if (this.isMoving) {
      return;
    }
    const moveUpValue = this.container.y - MOVING_DISTANCE_Y;
    await this.moveBoat({ y: moveUpValue }, UP_DIRECTION);
  };

  moveBoatLeft = async (e) => {
    if (this.isMoving) {
      return;
    }
    const moveLeftValue = this.container.x - MOVING_DISTANCE_X;
    await this.moveBoat({ x: moveLeftValue }, LEFT_DIRECTION);
  };

  moveBoatRight = async (e) => {
    if (this.isMoving) {
      return;
    }
    const moveRightValue = MOVING_DISTANCE_X + this.container.x;
    await this.moveBoat({ x: moveRightValue }, RIGHT_DIRECTION);
  };

  calculateRotationDegree = ({ headDirection, targetDirection }) => {
    const headDirectionIndex = DIRECTIONS.indexOf(headDirection);
    const targetDirectionIndex = DIRECTIONS.indexOf(targetDirection);
    const rotationDegree = (targetDirectionIndex - headDirectionIndex) * 90;
    const currentAngle = this.boat.angle;
    const degree = currentAngle + rotationDegree;
    return degree;
  };
}

export default BoatArrowsController;
