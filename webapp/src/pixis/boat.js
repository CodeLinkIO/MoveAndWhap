import { Container, AnimatedSprite, Texture, Rectangle } from "pixi.js";
import Boat2_water_frame1 from "../assets/Boat2_water_frame1.png";
import Boat2_water_frame2 from "../assets/Boat2_water_frame2.png";
import Boat2_water_frame3 from "../assets/Boat2_water_frame3.png";
import Boat2_water_frame4 from "../assets/Boat2_water_frame4.png";
import Cannon2_color3_1 from "../assets/Cannon2_color3_1.png";
import Cannon2_color3_2 from "../assets/Cannon2_color3_2.png";
import Cannon2_color3_3 from "../assets/Cannon2_color3_3.png";
import Fire1_1 from "../assets/Fire1_1.png";
import Fire1_2 from "../assets/Fire1_2.png";
import Fire1_3 from "../assets/Fire1_3.png";
import { addConfig } from "./utils/addConfig";
import pixiApp from "./app";
import {
  BOAT_CONTAINER_HEIGHT,
  BOAT_CONTAINER_WIDTH,
  BOAT_HEIGHT,
  BOAT_SIZE_AND_POSITION,
  DOWN_DIRECTION,
  LEFT_DIRECTION,
  RIGHT_DIRECTION,
  START_FIRING_EVENT,
  STOP_FIRING_EVENT,
  UP_DIRECTION,
} from "../constants/pixi";
import BoatArrowsController from "./boatArrowsController";
import PositionMapper from "./positionMapper";
import { CONTRACT_DIRECTION } from "../constants/contracts";

const BOAT_FRAMES = [
  Boat2_water_frame1,
  Boat2_water_frame2,
  Boat2_water_frame3,
  Boat2_water_frame4,
];

const CANNON_FRAMES = [Cannon2_color3_1, Cannon2_color3_2, Cannon2_color3_3];

const FIRE_FRAMES = [Fire1_1, Fire1_2, Fire1_3];

const ANIMATION_SPEED = 0.198;
const FIRE_TIME = 2000;

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

    this.setupCannon();
  };

  setupCannon = () => {
    this.cannon = new AnimatedSprite(
      CANNON_FRAMES.map((stringy) => Texture.from(stringy))
    );
    this.cannon.zIndex = 2;
    this.cannon.anchor.set(0.5);
    this.cannon.animationSpeed = ANIMATION_SPEED;
    this.boat.addChild(this.cannon);

    this.setupFire();
  };

  setupFire = () => {
    this.fireFrames = new AnimatedSprite(
      FIRE_FRAMES.map((stringy) => Texture.from(stringy))
    );
    this.fireFrames.zIndex = 2;
    this.fireFrames.anchor.set(0.5);
    this.fireFrames.y = BOAT_HEIGHT / 2;
    this.fireFrames.animationSpeed = ANIMATION_SPEED;
    this.fireFrames.visible = false;

    this.cannon?.addChild(this.fireFrames);
  };

  setupArrows = ({ isCurrentPlayer }) => {
    this.arrowsController = new BoatArrowsController({
      container: this,
      isCurrentPlayer,
    });
    this.arrowsController.zIndex = 100;
  };

  getArrowController = () => {
    return this.arrowsController;
  };

  setupHitBox = () => {
    const x = -BOAT_CONTAINER_WIDTH / 2;
    const y = -BOAT_CONTAINER_HEIGHT / 2;
    const hitBoxWidth = BOAT_CONTAINER_WIDTH + BOAT_CONTAINER_WIDTH / 2;
    const hitBoxHeight = BOAT_CONTAINER_HEIGHT + BOAT_CONTAINER_HEIGHT / 2;
    this.hitBox = new Rectangle(x, y, hitBoxWidth, hitBoxHeight);
  };

  getHitBox = () => {
    return this.hitBox;
  };

  move = async (directionNum) => {
    const direction = CONTRACT_DIRECTION[directionNum];
    switch (direction) {
      case DOWN_DIRECTION:
        this.arrowsController.moveBoatDown();
        break;

      case UP_DIRECTION:
        this.arrowsController.moveBoatUp();
        break;

      case LEFT_DIRECTION:
        this.arrowsController.moveBoatLeft();
        break;

      case RIGHT_DIRECTION:
        this.arrowsController.moveBoatRight();
        break;

      default:
        break;
    }
  };

  triggerFireAnimation = ({ onComplete }) => {
    const arrowController = this.getArrowController();

    arrowController.emitEvent(START_FIRING_EVENT);
    this.cannon.play();
    this.fireFrames.visible = true;
    this.fireFrames.play();

    setTimeout(() => {
      this.cannon.gotoAndStop(0);
      this.fireFrames.gotoAndStop(0);
      this.fireFrames.visible = false;
      arrowController.emitEvent(STOP_FIRING_EVENT);
      onComplete();
    }, FIRE_TIME);
  };
}

export default Boat;
