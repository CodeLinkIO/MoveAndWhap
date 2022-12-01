import { boxBox } from "intersects";
import { Graphics, Sprite, Texture } from "pixi.js";
import {
  ARROW_HEIGHT,
  BOAT_CONTAINER_HEIGHT,
  BOAT_CONTAINER_WIDTH,
  DOWN_DIRECTION,
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
  START_MOVING_EVENT,
  STOP_MOVING_EVENT,
  UP_DIRECTION,
} from "../constants/pixi";
import pixiApp from "./app";
import MapBorder from "./mapBorder";
import PositionMapper from "./positionMapper";

class Arrow {
  arrow = null;
  type = DOWN_DIRECTION;

  constructor(path, onClick, type, container) {
    this.container = container;
    this.arrow = new Graphics();
    this.type = type;
    this.arrow.beginFill(0x66ccff);
    this.arrow.drawPolygon(path);
    this.arrow.endFill();
    this.arrow.interactive = true;
    this.arrow.zIndex = 5;
    this.arrow.on("pointertap", onClick);
    this.arrow.cursor = "pointer";
    this.viewport = pixiApp.getViewport();

    setTimeout(() => this.checkArrowVisibility(), 0);

    // Listen to moving state
    this.arrow.on(START_MOVING_EVENT, this.onStartMoving);
    this.arrow.on(STOP_MOVING_EVENT, this.onStopMoving);
  }

  getArrow() {
    return this.arrow;
  }

  onStartMoving = () => {
    this.arrow.cursor = "default";
    this.arrow.visible = false;
  };

  onStopMoving = () => {
    this.arrow.cursor = "pointer";
    this.checkArrowVisibility();
  };

  checkArrowVisibility = () => {
    const canMove = this.canMoveToThisDirection();
    if (!canMove) {
      this.arrow.visible = false;
      return;
    }

    this.arrow.visible = true;
  };

  toWorldPosition = (position) => {
    return this.viewport.toWorld(position);
  };

  calculateArrowPositionToWorldMap = () => {
    return this.toWorldPosition(this.container.toGlobal(this.arrow.position));
  };

  calculateHitBoxWithAdditionGap = (boat) => {
    const hitBox = boat.getHitBox();
    const { width, height } = hitBox;
    const { x, y } = this.toWorldPosition(boat.toGlobal(hitBox));

    return {
      x: x,
      y: y,
      width: width,
      height: height,
    };
  };

  checkBoatCollisionWithPlayerBoat = (boat) => {
    const boatHitBox = this.calculateHitBoxWithAdditionGap(boat);
    const playerBoatHixBox = this.calculateHitBoxWithAdditionGap(
      this.container
    );

    const { x: x1, y: y1, width: w1, height: h1 } = boatHitBox;
    const { x: x2, y: y2, width: w2, height: h2 } = playerBoatHixBox;

    const intersected = boxBox(x1, y1, w1, h1, x2, y2, w2, h2);

    return intersected;
  };

  canMoveLeft = (arrowHitBox) => {
    const isReachedLeftBorder = MapBorder.reachLeftBorder(arrowHitBox);
    if (isReachedLeftBorder) return false;

    return true;

    // const isCollidedWithBoatOnLeft =
  };

  canMoveRight = (arrowHitBox) => {
    const isReachedRightBorder = MapBorder.reachRightBorder(arrowHitBox);
    if (isReachedRightBorder) return false;

    return true;

    // const isCollidedWithBoatOnRight =
  };

  canMoveUp = (arrowHitBox) => {
    const isReachedTopBorder = MapBorder.reachTopBorder(arrowHitBox);
    if (isReachedTopBorder) return false;

    const lowestTopBoat = PositionMapper.findNearestBoatUp(this.container);

    if (!lowestTopBoat) return true;

    const isCollidedWithBoatOnTop =
      this.checkBoatCollisionWithPlayerBoat(lowestTopBoat);

    return !isCollidedWithBoatOnTop;
  };

  canMoveDown = (arrowHitBox) => {
    const isReachedBottomBorder = MapBorder.reachBottomBorder(arrowHitBox);
    if (isReachedBottomBorder) return false;

    return true;

    // const isCollidedWithBoatOnBottom =
  };

  canMoveToThisDirection = () => {
    if (!this.arrow) return false;

    const hitBoxWidth = BOAT_CONTAINER_WIDTH - ARROW_HEIGHT;
    const hitBoxHeight = BOAT_CONTAINER_HEIGHT - ARROW_HEIGHT;
    const position = this.calculateArrowPositionToWorldMap();

    switch (this.type) {
      case LEFT_DIRECTION: {
        const arrowHitBox = {
          x2: position.x,
          y2: position.y,
          w2: hitBoxWidth,
          h2: hitBoxHeight,
        };

        return this.canMoveLeft(arrowHitBox);
      }

      case RIGHT_DIRECTION: {
        const arrowHitBox = {
          x2: position.x + hitBoxWidth,
          y2: position.y,
          w2: hitBoxWidth,
          h2: hitBoxHeight,
        };
        return this.canMoveRight(arrowHitBox);
      }

      case DOWN_DIRECTION: {
        const arrowHitBox = {
          x2: position.x,
          y2: position.y + hitBoxHeight,
          w2: hitBoxWidth,
          h2: hitBoxHeight,
        };
        return this.canMoveDown(arrowHitBox);
      }

      case UP_DIRECTION: {
        const arrowHitBox = {
          x2: position.x,
          y2: position.y,
          w2: hitBoxWidth,
          h2: hitBoxHeight,
        };

        return this.canMoveUp(arrowHitBox);
      }

      default:
        return true;
    }
  };
}

export default Arrow;
