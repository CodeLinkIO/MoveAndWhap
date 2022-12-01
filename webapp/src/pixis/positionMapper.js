import { filter } from "lodash";

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
}

export default PositionMapper;
