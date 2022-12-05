export const COMMANDS = {
  getPlayerStatus: "getPlayerStatus",
  getPlayersInRange: "getPlayersInRange",
  playerJoined: "playerJoined",
  playerMoved: "playerMoved",
  playerAttacked: "playerAttacked",
  error: "error",
};

export const WS_READY_STATE = {
  UNINSTANTIATED: -1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};
