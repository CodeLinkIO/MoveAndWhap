class PixiApp {
  app = null;
  viewport = null;
  mapContainer = null;
  walletAddress = null;
  socket = null;

  setApp = (app) => {
    this.app = app;
  };

  getApp = () => {
    return this.app;
  };

  setViewport = (viewport) => {
    this.viewport = viewport;
  };

  getViewport = () => {
    return this.viewport;
  };

  setMapContainer = (mapContainer) => {
    this.mapContainer = mapContainer;
  };

  getMapContainer = () => {
    return this.mapContainer;
  };

  setWalletAddress = (walletAddress) => {
    this.walletAddress = walletAddress;
  };

  getWalletAddress = () => {
    return this.walletAddress;
  };

  setSocket = (socket) => {
    this.socket = socket;
  };

  getSocket = () => {
    return this.socket;
  };
}

const pixiApp = new PixiApp();

export default pixiApp;
