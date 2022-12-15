import { boxBox } from "intersects";
import { Container, Graphics } from "pixi.js";
import { VIEWPORT_PADDING } from "../constants/pixi";
import pixiApp from "./app";

const MAP_BORDER_WIDTH = 10;

class MapBorder {
  static rightBorderPosition;
  static leftBorderPosition;
  static topBorderPosition;
  static bottomBorderPosition;
  viewport = null;

  static constructor() {}

  static initialize() {
    this.viewport = pixiApp.getViewport();
    this.container = new Container();
    this.drawBorder();
    this.viewport.addChild(this.container);
    pixiApp.setMapContainer(this.container);
    this.mapWidth = this.viewport.worldWidth - 2 * VIEWPORT_PADDING;
    this.mapHeight = this.viewport.worldHeight - 2 * VIEWPORT_PADDING;
  }

  static getGlobalPosition = () => {
    return this.viewport.toWorld(
      this.container.toGlobal({
        x: this.line.x + VIEWPORT_PADDING,
        y: this.line.y + VIEWPORT_PADDING,
      })
    );
  };

  static getLeftBorderPosition = () => {
    const { x, y } = this.getGlobalPosition();
    const leftBorderPosition = {
      x1: x,
      y1: y,
      w1: MAP_BORDER_WIDTH,
      h1: this.mapHeight,
    };
    return leftBorderPosition;
  };

  static getRightBorderPosition = () => {
    const { x, y } = this.getGlobalPosition();
    const rightBorderPosition = {
      x1: x + this.mapWidth,
      y1: y,
      w1: MAP_BORDER_WIDTH,
      h1: this.mapHeight,
    };
    return rightBorderPosition;
  };

  static getBottomBorderPosition = () => {
    const { x, y } = this.getGlobalPosition();
    const bottomBorderPosition = {
      x1: x,
      y1: y + this.mapHeight,
      w1: this.mapWidth,
      h1: MAP_BORDER_WIDTH,
    };
    return bottomBorderPosition;
  };

  static getTopBorderPosition = () => {
    const { x, y } = this.getGlobalPosition();
    const topBorderPosition = {
      x1: x,
      y1: y,
      w1: this.mapWidth,
      h1: MAP_BORDER_WIDTH,
    };
    return topBorderPosition;
  };

  static drawBorder = () => {
    this.line = new Graphics();
    this.line
      .lineStyle(MAP_BORDER_WIDTH, 0xff0000)
      .drawRect(
        VIEWPORT_PADDING,
        VIEWPORT_PADDING,
        this.mapWidth,
        this.mapHeight
      );
    this.container.addChild(this.line);
  };

  static checkIntersectBoxToBox = (box1, box2) => {
    const { x1, y1, w1, h1 } = box1;
    const { x2, y2, w2, h2 } = box2;

    const intersected = boxBox(x1, y1, w1, h1, x2, y2, w2, h2);
    return intersected;
  };

  static reachLeftBorder = (position) => {
    const leftBorderPosition = this.getLeftBorderPosition();

    const intersected = this.checkIntersectBoxToBox(
      leftBorderPosition,
      position
    );
    return intersected;
  };

  static reachRightBorder = (position) => {
    const rightBorderPosition = this.getRightBorderPosition();

    const intersected = this.checkIntersectBoxToBox(
      rightBorderPosition,
      position
    );
    return intersected;
  };

  static reachBottomBorder = (position) => {
    const bottomBorderPosition = this.getBottomBorderPosition();

    const intersected = this.checkIntersectBoxToBox(
      bottomBorderPosition,
      position
    );
    return intersected;
  };

  static reachTopBorder = (position) => {
    const topBorderPosition = this.getTopBorderPosition();

    const intersected = this.checkIntersectBoxToBox(
      topBorderPosition,
      position
    );
    return intersected;
  };
}

export default MapBorder;
