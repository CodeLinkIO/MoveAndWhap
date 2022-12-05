import { isEmpty, remove } from "lodash";
import { CONTRACT_DIRECTION } from "../constants/contracts";
import { BOAT_CONTAINER_HEIGHT, BOAT_CONTAINER_WIDTH } from "../constants/pixi";
import { COMMANDS } from "../constants/webSockets";
import { formatBoatData } from "../utils/contract";
import { convertPlayerPositionToGameCoordinate } from "../utils/numbers";
import pixiApp from "./app";
import Boat from "./boat";
import PositionMapper from "./positionMapper";

export const onWsOpen = () => {
  console.log("Connected to websocket server.");
};

export const onWsMessage = (event) => {
  const data = JSON.parse(event.data);

  console.log("event.data", event.data);

  switch (data.command) {
    case COMMANDS.getPlayersInRange:
      handleReceivePlayersInRange(data);
      break;

    case COMMANDS.playerJoined:
      handlePlayerJoined(data);
      break;

    case COMMANDS.playerMoved:
      handlePlayerMoved(data);
      break;

    case COMMANDS.playerAttacked:
      handlePlayerAttacked(data);
      break;

    case COMMANDS.error:
      console.log(data);
      break;

    default:
      break;
  }
};

const handleReceivePlayersInRange = (wsResponse) => {
  const currentPlayerAddress = pixiApp.getWalletAddress();

  let { data } = wsResponse;

  const currentPlayer = remove(data, (boat) => {
    return boat.address === currentPlayerAddress;
  });

  // Reset all the current positions mapping and let the boat re-init the mapping.
  PositionMapper.resetMapPosition();

  data.forEach((player) => {
    addPlayerToGame({ player, currentPlayerAddress });
  });

  if (isEmpty(currentPlayer)) return;

  // Player boat must be created last in the list
  addPlayerToGame({ player: currentPlayer[0], currentPlayerAddress });
};

export const addPlayerToGame = ({ player, currentPlayerAddress }) => {
  const { x, y, dir, address } = player;
  const playerBoat = formatBoatData([x, y, dir, true]);

  const playerBoatPosition = convertPlayerPositionToGameCoordinate({
    x: playerBoat.x,
    y: playerBoat.y,
  });

  const boat = addBoatToScreen({
    playerPosition: playerBoatPosition,
    address,
    isCurrentPlayer: address === currentPlayerAddress,
    directionNum: playerBoat.directionNum,
  });

  return boat;
};

const addBoatToScreen = ({
  playerPosition,
  address,
  isCurrentPlayer,
  directionNum,
}) => {
  const { x, y } = playerPosition;
  const headDirection = CONTRACT_DIRECTION[directionNum];

  const boat = new Boat({
    boatContainerOptions: {
      x,
      y,
      width: BOAT_CONTAINER_WIDTH,
      height: BOAT_CONTAINER_HEIGHT,
    },
    address,
    isCurrentPlayer,
    headDirection,
  });

  return boat;
};

export const getPlayersInRange = async ({ x, y, range }) => {
  const ws = pixiApp.getSocket();
  if (!ws) return;

  const msg = JSON.stringify({
    command: "getPlayersInRange",
    x: x,
    y: y,
    range: range,
  });
  ws.send(msg);
};

const handlePlayerJoined = (wsResponse) => {
  const { data, address } = wsResponse;

  const isCurrentPlayerJoined = isCurrentPlayerAddress(address);

  addPlayerToGame({
    player: { ...data, address },
    currentPlayerAddress: address,
  });

  if (isCurrentPlayerJoined) {
    const viewport = pixiApp.getViewport();
    const { x, y } = convertPlayerPositionToGameCoordinate({
      x: data.x,
      y: data.y,
    });

    viewport.moveCenter(x, y);
  }
};

const handlePlayerMoved = (wsResponse) => {
  const { data, address } = wsResponse;
  const playerBoat = PositionMapper.getBoatByAddress(address);

  if (!playerBoat) {
    console.log("Player boat not found on screen.");
    return;
  }
  const isCurrentPlayer = isCurrentPlayerAddress(address);

  // This move already been handled by the Boat class
  if (isCurrentPlayer) {
    return;
  }

  const { dir } = data;

  playerBoat.move(dir);
};

const isCurrentPlayerAddress = (address) => {
  const currentPlayerAddress = pixiApp.getWalletAddress();
  const isCurrentPlayer = currentPlayerAddress === address;
  return isCurrentPlayer;
};

const handlePlayerAttacked = (wsResponse) => {
  const { data } = wsResponse;
  const { attacker, victim } = data;
  const attackerBoat = PositionMapper.getBoatByAddress(attacker);
  const victimBoat = PositionMapper.getBoatByAddress(victim);

  PositionMapper.removeBoatFromMap(victim);

  attackerBoat.triggerFireAnimation({
    onComplete: () => {
      victimBoat.destroy();
    },
  });
};
