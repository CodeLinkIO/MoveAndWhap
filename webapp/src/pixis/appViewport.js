import { Simple } from "pixi-cull";
import { Viewport } from "pixi-viewport";
import { Ticker } from "pixi.js";
import pixiApp from "./app";

const MIN_ZOOM = 500;
const MAX_ZOOM = 5000;

class AppViewport extends Viewport {
  constructor(options) {
    super(options);
    const app = pixiApp.getApp();
    pixiApp.setViewport(this);
    app.stage.addChild(this);
    this.setClapZoom();
    this.setClamp();
    this.setupCulling();
  }

  setClamp = () => {
    this.clamp({
      left: 0,
      right: this.worldWidth,
      top: 0,
      bottom: this.worldHeight,
    });
  };

  setClapZoom = () => {
    this.clampZoom({
      minWidth: MIN_ZOOM,
      minHeight: MIN_ZOOM,
      maxWidth: MAX_ZOOM,
      maxHeight: MAX_ZOOM,
    });
  };

  setupViewportInteraction = () => {
    return this.drag().pinch().wheel().decelerate();
  };

  setupCulling = () => {
    const cull = new Simple(); // new SpatialHash()
    cull.addList(this.children);
    cull.cull(this.getVisibleBounds());

    // cull whenever the viewport moves
    Ticker.shared.add(() => {
      if (this.dirty) {
        cull.cull(this.getVisibleBounds());
        this.dirty = false;
      }
    });
  };
}

export default AppViewport;
