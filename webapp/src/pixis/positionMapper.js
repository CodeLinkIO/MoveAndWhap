import { boxBox } from "intersects";
import { filter } from "lodash";
import { DIRECTION_OPPOSITE } from "../constants/contracts";
import pixiApp from "./app";

class PositionMapper {
  static mapPositionX = {};
  static mapPositionY = {};
  static boatMap = {};

  static setMapPositionX = (boat) => {
    const { x } = boat.position;
    const boatsOnX = PositionMapper.mapPositionX[x] || [];
    boatsOnX.push(boat);
    PositionMapper.mapPositionX[x] = boatsOnX;
  };

  static setMapPositionY = (boat) => {
    const { y } = boat.position;
    const boatsOnY = PositionMapper.mapPositionY[y] || [];
    boatsOnY.push(boat);
    PositionMapper.mapPositionY[y] = boatsOnY;
  };

  static setBoatMap = (boat) => {
    const address = boat.address;
    PositionMapper.boatMap[address] = boat;
  };

  static setBoatPositionToMap = (boat) => {
    PositionMapper.setMapPositionX(boat);
    PositionMapper.setMapPositionY(boat);
    PositionMapper.setBoatMap(boat);
  };

  static getBoatByAddress = (address) => {
    return PositionMapper.boatMap[address];
  };

  static getBoatsOnX = (x) => {
    return PositionMapper.mapPositionX[x] || [];
  };

  static getBoatsOnY = (y) => {
    return PositionMapper.mapPositionY[y] || [];
  };

  static findNearestBoatUp = (playerBoat) => {
    const { x: playerBoatX, y: playerBoatY } = playerBoat.position;

    const boatsOnSameX = PositionMapper.getBoatsOnX(playerBoatX);
    const topBoats = filter(boatsOnSameX, (boat) => {
      const isTopBoat =
        boat.position.y < playerBoatY && boat.address !== playerBoat.address;
      return isTopBoat;
    });

    if (topBoats.length === 0) return null;

    const lowestTopBoat = topBoats.reduce((lowestBoat, boat) => {
      if (boat.position.y > lowestBoat.position.y) return boat;
      return lowestBoat;
    });

    return lowestTopBoat;
  };

  static findNearestBoatDown = (playerBoat) => {
    const { x: playerBoatX, y: playerBoatY } = playerBoat.position;

    const boatsOnSameX = PositionMapper.getBoatsOnX(playerBoatX);
    const bottomBoats = filter(boatsOnSameX, (boat) => {
      const isBottomBoat =
        boat.position.y > playerBoatY && boat.address !== playerBoat.address;
      return isBottomBoat;
    });

    if (bottomBoats.length === 0) return null;

    const topMostBottomBoat = bottomBoats.reduce((topMostBoat, boat) => {
      if (boat.position.y < topMostBoat.position.y) return boat;
      return topMostBoat;
    });

    return topMostBottomBoat;
  };

  static findNearestLeftBoat = (playerBoat) => {
    const { x: playerBoatX, y: playerBoatY } = playerBoat.position;

    const boatsOnSameY = PositionMapper.getBoatsOnY(playerBoatY);
    const leftBoats = filter(boatsOnSameY, (boat) => {
      const isLeftBoat =
        boat.position.x < playerBoatX && boat.address !== playerBoat.address;
      return isLeftBoat;
    });

    if (leftBoats.length === 0) return null;

    const rightMostLeftBoat = leftBoats.reduce((rightMostBoat, boat) => {
      if (boat.position.x > rightMostBoat.position.x) return boat;
      return rightMostBoat;
    });

    return rightMostLeftBoat;
  };

  static findNearestRightBoat = (playerBoat) => {
    const { x: playerBoatX, y: playerBoatY } = playerBoat.position;

    const boatsOnSameY = PositionMapper.getBoatsOnY(playerBoatY);
    const rightBoats = filter(boatsOnSameY, (boat) => {
      const isRightBoat =
        boat.position.x > playerBoatX && boat.address !== playerBoat.address;
      return isRightBoat;
    });

    if (rightBoats.length === 0) return null;

    const leftMostRightBoat = rightBoats.reduce((leftMostBoat, boat) => {
      if (boat.position.x < leftMostBoat.position.x) return boat;
      return leftMostBoat;
    });

    return leftMostRightBoat;
  };

  static toWorldPosition = (position) => {
    return pixiApp.getViewport().toWorld(position);
  };

  static calculateHitBox = (boat) => {
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

  static checkBoatCollisionWithPlayerBoat = (playerBoat, boat) => {
    const boatHitBox = this.calculateHitBox(boat);
    const playerBoatHixBox = this.calculateHitBox(playerBoat);

    const { x: x1, y: y1, width: w1, height: h1 } = boatHitBox;
    const { x: x2, y: y2, width: w2, height: h2 } = playerBoatHixBox;

    const intersected = boxBox(x1, y1, w1, h1, x2, y2, w2, h2);

    return intersected;
  };

  static checkLeftCollision = (playerBoat) => {
    const nearestLeftBoat = this.findNearestLeftBoat(playerBoat);

    if (!nearestLeftBoat) return false;

    const isCollidedWithBoatOnLeft = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestLeftBoat
    );

    return isCollidedWithBoatOnLeft;
  };

  static checkRightCollision = (playerBoat) => {
    const nearestRightBoat = this.findNearestRightBoat(playerBoat);

    if (!nearestRightBoat) return false;

    const isCollidedWithBoatOnRight = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestRightBoat
    );

    return isCollidedWithBoatOnRight;
  };

  static checkTopCollision = (playerBoat) => {
    const nearestTopBoat = this.findNearestBoatUp(playerBoat);

    if (!nearestTopBoat) return false;

    const isCollidedWithBoatOnTop = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestTopBoat
    );

    return isCollidedWithBoatOnTop;
  };

  static checkBottomCollision = (playerBoat) => {
    const nearestBottomBoat = this.findNearestBoatDown(playerBoat);

    if (!nearestBottomBoat) return false;

    const isCollidedWithBoatOnBottom = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestBottomBoat
    );

    return isCollidedWithBoatOnBottom;
  };

  static checkHeadToHead = (playerBoat, targetBoat) => {
    const playerHead = playerBoat.getHeadDirection();
    const targetHead = targetBoat.getHeadDirection();

    const directionOppositeWithPlayer = DIRECTION_OPPOSITE[playerHead];

    const isHeadToHead = directionOppositeWithPlayer === targetHead;
    return isHeadToHead;
  };

  static getFireableBoatOnLeft = (playerBoat) => {
    const nearestLeftBoat = this.findNearestLeftBoat(playerBoat);
    if (!nearestLeftBoat) return null;

    const isCollidedWithBoatOnLeft = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestLeftBoat
    );

    const isHeadToHead = this.checkHeadToHead(playerBoat, nearestLeftBoat);

    if (isCollidedWithBoatOnLeft && isHeadToHead) return nearestLeftBoat;

    return null;
  };

  static getFireableBoatOnRight = (playerBoat) => {
    const nearestRightBoat = this.findNearestRightBoat(playerBoat);
    if (!nearestRightBoat) return null;

    const isCollidedWithBoatOnRight = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestRightBoat
    );

    const isHeadToHead = this.checkHeadToHead(playerBoat, nearestRightBoat);

    if (isCollidedWithBoatOnRight && isHeadToHead) return nearestRightBoat;

    return null;
  };

  static getFireableBoatOnTop = (playerBoat) => {
    const nearestTopBoat = this.findNearestBoatUp(playerBoat);
    if (!nearestTopBoat) return null;

    const isCollidedWithBoatOnTop = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestTopBoat
    );

    const isHeadToHead = this.checkHeadToHead(playerBoat, nearestTopBoat);

    if (isCollidedWithBoatOnTop && isHeadToHead) return nearestTopBoat;

    return null;
  };

  static getFireableBoatOnBottom = (playerBoat) => {
    const nearestBottomBoat = this.findNearestBoatDown(playerBoat);
    if (!nearestBottomBoat) return null;

    const isCollidedWithBoatOnBottom = this.checkBoatCollisionWithPlayerBoat(
      playerBoat,
      nearestBottomBoat
    );

    const isHeadToHead = this.checkHeadToHead(playerBoat, nearestBottomBoat);

    if (isCollidedWithBoatOnBottom && isHeadToHead) return nearestBottomBoat;

    return null;
  };
}

export default PositionMapper;
