import { Graphics, Ticker } from "pixi.js";
import { Group, Tween } from "tweedle.js";
import {
  ARROW_HEIGHT,
  BOAT_CONTAINER_HEIGHT,
  BOAT_CONTAINER_WIDTH,
  BOUNCE_POSITION_BY_DIRECTION,
  DOWN_DIRECTION,
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
  START_MOVING_EVENT,
  STOP_MOVING_EVENT,
  UP_DIRECTION,
  START_FIRING_EVENT,
  STOP_FIRING_EVENT,
  ENEMY_STOP_MOVING_EVENT,
  ENEMY_STOP_FIRING_EVENT,
} from "../constants/pixi";
import pixiApp from "./app";
import MapBorder from "./mapBorder";
import PositionMapper from "./positionMapper";

class Arrow {
  arrow = null;
  direction = DOWN_DIRECTION;

  constructor(path, onClick, direction, container) {
    this.container = container;
    this.arrow = new Graphics();
    this.direction = direction;
    this.arrow.beginFill(0x66ccff);
    this.arrow.drawPolygon(path);
    this.arrow.endFill();
    this.arrow.interactive = true;
    this.arrow.zIndex = 5;
    this.arrow.on("pointertap", onClick);
    this.arrow.cursor = "pointer";
    this.viewport = pixiApp.getViewport();

    setTimeout(() => this.checkArrowVisibility(), 0);

    this.setupBouncingAnimation();

    // Listen to moving state
    this.arrow.on(START_MOVING_EVENT, this.onStartMoving);
    this.arrow.on(STOP_MOVING_EVENT, this.onStopMoving);

    this.arrow.on(START_FIRING_EVENT, this.onStartFiring);
    this.arrow.on(STOP_FIRING_EVENT, this.onStopFiring);

    this.arrow.on(ENEMY_STOP_MOVING_EVENT, this.onEnemyStopMoving);
    this.arrow.on(ENEMY_STOP_FIRING_EVENT, this.onEnemyStopFiring);
  }

  getArrow() {
    return this.arrow;
  }

  setupBouncingAnimation = () => {
    Ticker.shared.add(() => {
      Group.shared.update();
    });

    this.bouncingAnimation = new Tween(this.arrow);
    const bouncePosition = BOUNCE_POSITION_BY_DIRECTION[this.direction];
    const x = this.arrow.x + bouncePosition.x;
    const y = this.arrow.y + bouncePosition.y;
    this.bouncingAnimation
      .to({ x, y }, 400, "easeOutQuad")
      .yoyo(true)
      .repeat(Infinity)
      .start();
  };

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

  canMoveLeft = (arrowHitBox) => {
    const isReachedLeftBorder = MapBorder.reachLeftBorder(arrowHitBox);
    if (isReachedLeftBorder) return false;

    const isCollidedWithBoatOnLeft = PositionMapper.checkLeftCollision(
      this.container
    );

    return !isCollidedWithBoatOnLeft;
  };

  canMoveRight = (arrowHitBox) => {
    const isReachedRightBorder = MapBorder.reachRightBorder(arrowHitBox);
    if (isReachedRightBorder) return false;

    const isCollidedWithBoatOnRight = PositionMapper.checkRightCollision(
      this.container
    );

    return !isCollidedWithBoatOnRight;
  };

  canMoveUp = (arrowHitBox) => {
    const isReachedTopBorder = MapBorder.reachTopBorder(arrowHitBox);
    if (isReachedTopBorder) return false;

    const isCollidedWithBoatOnTop = PositionMapper.checkTopCollision(
      this.container
    );

    return !isCollidedWithBoatOnTop;
  };

  canMoveDown = (arrowHitBox) => {
    const isReachedBottomBorder = MapBorder.reachBottomBorder(arrowHitBox);
    if (isReachedBottomBorder) return false;

    const isCollidedWithBoatOnBottom = PositionMapper.checkBottomCollision(
      this.container
    );

    return !isCollidedWithBoatOnBottom;
  };

  canMoveToThisDirection = () => {
    if (!this.arrow) return false;

    const hitBoxWidth = BOAT_CONTAINER_WIDTH - ARROW_HEIGHT;
    const hitBoxHeight = BOAT_CONTAINER_HEIGHT - ARROW_HEIGHT;
    const position = this.calculateArrowPositionToWorldMap();

    switch (this.direction) {
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

  onStartFiring = () => {
    this.getArrow().visible = false;
  };

  onStopFiring = () => {
    this.checkArrowVisibility();
  };

  onEnemyStopMoving = () => {
    this.checkArrowVisibility();
  };

  onEnemyStopFiring = () => {
    this.checkArrowVisibility();
  };
}

export default Arrow;
