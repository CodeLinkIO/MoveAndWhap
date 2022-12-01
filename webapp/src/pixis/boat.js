import { Container, AnimatedSprite, Texture, Rectangle } from "pixi.js";
import Boat2_water_frame1 from "../assets/Boat2_water_frame1.png";
import Boat2_water_frame2 from "../assets/Boat2_water_frame2.png";
import Boat2_water_frame3 from "../assets/Boat2_water_frame3.png";
import Boat2_water_frame4 from "../assets/Boat2_water_frame4.png";
import { addConfig } from "./utils/addConfig";
import pixiApp from "./app";
import { BOAT_SIZE_AND_POSITION, DOWN_DIRECTION } from "../constants/pixi";
import BoatArrowsController from "./boatArrowsController";
import PositionMapper from "./positionMapper";

const BOAT_FRAMES = [
  Boat2_water_frame1,
  Boat2_water_frame2,
  Boat2_water_frame3,
  Boat2_water_frame4,
];

const ANIMATION_SPEED = 0.198;

class Boat extends Container {
  boat = null;
  mapContainer = null;
  movingTweeny = null;
  isMoving = false;
  downArrow = null;
  upArrow = null;
  lefArrow = null;
  rightArrow = null;
  arrowsController = null;
  address = null;
  hitBox = null;
  isCurrentPlayer = false;
  headDirection = DOWN_DIRECTION;

  constructor({
    boatSpriteOptions = {},
    boatContainerOptions = {},
    headDirection,
    address,
    isCurrentPlayer = false,
  }) {
    super();

    this.address = address;
    this.isCurrentPlayer = isCurrentPlayer;
    this.headDirection = headDirection;
    if (isCurrentPlayer) {
      this.zIndex = 100;
    }
    addConfig({ pixiObject: this, config: boatContainerOptions });
    this.setupBoat(boatSpriteOptions);
    this.setupHitBox();
    this.setupArrows({ headDirection, isCurrentPlayer });

    this.mapContainer = pixiApp.getMapContainer();
    this.mapContainer.addChild(this);
    PositionMapper.setBoatPositionToMap(this);
  }

  getBoat = () => {
    return this.boat;
  };

  getBoatContainer = () => {
    return this;
  };

  setHeadDirection = (headDirection) => {
    this.headDirection = headDirection;
  };

  getHeadDirection = () => {
    return this.headDirection;
  };

  setupBoat = (boatSpriteOptions) => {
    this.boat = new AnimatedSprite(
      BOAT_FRAMES.map((stringy) => Texture.from(stringy))
    );
    this.boat.zIndex = 1;
    this.boat.animationSpeed = ANIMATION_SPEED;
    addConfig({
      pixiObject: this.boat,
      config: { ...BOAT_SIZE_AND_POSITION, ...boatSpriteOptions },
    });
    this.boat.anchor.set(0.5);
    this.addChild(this.boat);
    this.boat.play();
  };

  setupArrows = ({ isCurrentPlayer }) => {
    this.arrowsController = new BoatArrowsController({
      container: this,
      onDownArrowClick: this.moveBoatDown,
      isCurrentPlayer,
    });
    this.arrowsController.zIndex = 100;
  };

  setupHitBox = () => {
    const { width, height } = this;
    const x = -width / 2;
    const y = -height / 2;
    const hitBoxWidth = width + width / 2;
    const hitBoxHeight = height + height / 2;
    this.hitBox = new Rectangle(x, y, hitBoxWidth, hitBoxHeight);
  };

  getHitBox = () => {
    return this.hitBox;
  };
}

export default Boat;
