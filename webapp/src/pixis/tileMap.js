import { Texture, TilingSprite } from "pixi.js";
import tileWater from "../assets/tile_water.png";
import { CENTER_POSITION } from "../constants/pixi";
import pixiApp from "./app";
import MapBorder from "./mapBorder";

class TileMap {
  static constructor() {}

  static initialize(currentPlayerPosition) {
    this.viewport = pixiApp.getViewport();
    this.tile = new TilingSprite(
      Texture.from(tileWater),
      this.viewport.worldWidth,
      this.viewport.worldHeight
    );

    const currentX = currentPlayerPosition
      ? currentPlayerPosition.x
      : CENTER_POSITION;
    const currentY = currentPlayerPosition
      ? currentPlayerPosition.y
      : CENTER_POSITION;

    this.tile.x = currentX - this.viewport.worldWidth / 2;
    this.tile.y = currentY - this.viewport.worldHeight / 2;
    this.viewport.addChild(this.tile);

    this.setupViewportOnMoveEvent();
    MapBorder.initialize();
  }

  static setupViewportOnMoveEvent = () => {
    this.viewport.on("moved", () => {
      this.calculateTilePosition();
    });
  };

  static calculateTilePosition = () => {
    this.tile.tilePosition.y = -this.viewport.top;
    this.tile.tilePosition.x = -this.viewport.left;
    this.tile.y = this.viewport.top;
    this.tile.x = this.viewport.left;

    this.tile.width = this.viewport.worldWidth / this.viewport.scale.x;
    this.tile.height = this.viewport.worldHeight / this.viewport.scale.y;
  };
}

export default TileMap;
