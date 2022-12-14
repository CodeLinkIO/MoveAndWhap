const WALLET_ADDRESS = "WALLET_ADDRESS";
const BOAT_INITIAL_POSITION = "BOAT_INITIAL_POSITION";

export const storeCurrentPlayerWalletAddress = (account) => {
  localStorage.setItem(WALLET_ADDRESS, account);
};

export const getCurrentPlayerWalletAddress = () => {
  return localStorage.getItem(WALLET_ADDRESS);
};

export const removeCurrentPlayerWalletAddress = () => {
  localStorage.removeItem(WALLET_ADDRESS);
};

export const storeBoatInitialPosition = async (position) => {
  sessionStorage.setItem(BOAT_INITIAL_POSITION, JSON.stringify(position));
};

export const getBoatInitialPosition = () => {
  return JSON.parse(sessionStorage.getItem(BOAT_INITIAL_POSITION));
};

export const removeBoatInitialPosition = () => {
  sessionStorage.removeItem(BOAT_INITIAL_POSITION);
};
