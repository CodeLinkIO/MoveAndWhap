# Move And Whap Webapp (MaW)

Webapp for Move And Whap (MaW) game demo showcasing how to build a game where all user actions are on-chain.

## Description

This was made to help developers understand how to code a web3 game with ReactJs and PixiJs engine.

- The framework is [ReactJs](https://reactjs.org/).

- The game engine is [PixiJS](https://pixijs.com/).

## Getting Started

### Dependencies

- nvm
- node version `>=18.0.0` or `19.0.0`
- yarn (This webapp uses yarn as package manager no npm)

### Installing

- Installing all the packages

```
cd webapp
yarn install
```

### Webapp env config:

- In the webapp folder of the project, make a file called **.env**.
- Add these parameters (Shown in **env.example**):

  - **REACT_APP_MAW_CONTRACT_ADDRESS**: Your deployed contract address. <br> This must be the same as **MAW_CONTRACT_ADDRESS** in the backend.

  - **REACT_APP_CHAIN_ID**: This is the network chain ID to config [@userdapp](https://usedapp-docs.netlify.app/docs). <br/>
    Currently we support 2 networks: 43114 (Fuji) and 31337 (HardHat). <br> If you are using a different network, you will need to modify logic in `webapp/src/providers/walletProvider.js`.

  - **REACT_APP_WS_URL**: Your backend websocket url example: `ws://localhost:7070`.

  - **REACT_APP_CONNECTOR_TYPE**: This is the type of connector the app can use to connect to the wallet. <br/>
    Currently, the app supports 2 kind of connector: `metamask` and `sequence`.
    <br>
    For `metamask` connector, you will need to install [Metamask](https://metamask.io/) extension on your browser.
    <br>
    For `sequence` connector, you don't need to install any extension. The [Sequence app](https://sequence.app/) will handle it.
    <br>

    **_NOTE_**:
    For local HardHat network, only use `metamask` connector. The sequence connector does not support local network.
    <br>

    If you are using a different connector, you will need to modify logic in `webapp/src/providers/walletProvider.js`. More details on [@userdapp connector](https://usedapp-docs.netlify.app/docs/Guides/Connecting/Wallet%20Connectors).

### Run on local machine

- You can read more about how to run the FE with specific network (HardHat or FUJI) in the next section.

- **NOTE**: Make sure you have already deployed the contract on HardHat local network, run the backend server, and add all the necessary env vars.
- In the webapp folder run:

```
yarn start
```

The app will run on `http://localhost:3000`.

### Config to run with HardHat in Local:

- **NOTE**: Make sure you have already deployed the contract on HardHat local network, run the backend server. <br>
  If you have not done that yet, please follow the instruction in the root README.md file.

- Create a new env file named `.env.hardhat` in the webapp folder:

  - **REACT_APP_MAW_CONTRACT_ADDRESS**: Your deployed contract address. <br> This must be the same as **MAW_CONTRACT_ADDRESS** in the root .env file.
  - **REACT_APP_CHAIN_ID**: 31337 (HardHat local network)
  - **REACT_APP_WS_URL**: `ws://localhost:7070` (Backend websocket url, this value is based on the ws port in the root folder .env file)
  - **REACT_APP_CONNECTOR_TYPE**: `metamask` (Only support metamask for local network HardHat)

- Run the app with:

  ```
    yarn start:hardhat
  ```

- The app will copy everything in .env.hardhat to .env and run the app with the new .env file.
- The app will run on `http://localhost:3000`.

### Config to run with FUJI testnet in local:

- **NOTE**: Make sure you have already deployed the contract on FUJI testnet, run the backend server. <br>
  If you have not done it yet, please follow the instruction in the root README.md file.

- Create a new env file named `.env.fuji` in the webapp folder:

  - **REACT_APP_MAW_CONTRACT_ADDRESS**: Your deployed contract address on FUJI network. <br> This must be the same as **MAW_CONTRACT_ADDRESS** in the root .env file.
  - **REACT_APP_CHAIN_ID**: 43114 (FUJI testnet)
  - **REACT_APP_WS_URL**: `ws://localhost:7070` (Backend websocket url, this value is based on the ws port in the root folder .env file)
  - **REACT_APP_CONNECTOR_TYPE**: `sequence` (Use Sequence for test network)

- Run the app with:

  ```
    yarn start:fuji
  ```

- The app will copy everything in .env.fuji to .env and run the app with the new .env file.

- The app will run on `http://localhost:3000`.

### Connect and join with Metamask and HartHat local network

**Import a Hardhat account to Metamask**

- Open your Metamask extension.
- Click on top right corner.
- Click on `Import account`
  <br>
  <br>
  <img width="358" alt="Screen Shot 2022-12-16 at 12 54 41" src="https://user-images.githubusercontent.com/28186870/208032031-b5a124e9-f20b-4301-9d59-5f47e19c575c.png">
  <br>

- Copy the private key of one of the HardHat accounts (You can find it in the terminal when you run `npm run node` on the root folder).
- Paste the private key to Metamask.
- Click on `Import`.
  <br>
  <br>
  <img width="357" alt="Screen Shot 2022-12-16 at 12 55 24" src="https://user-images.githubusercontent.com/28186870/208032510-969f6bc1-9270-4694-a6d7-8160269d22ba.png">
  <br>
- You will see the account imported.

**Connect to HardHat local network**

- If you do not have the HardHat network configured in Metamask, you will need to add it or metamask will add it for you after you connect.
  <br>
  <br>
  <img width="359" alt="Screen Shot 2022-12-16 at 13 00 12" src="https://user-images.githubusercontent.com/28186870/208035238-1a4160af-90f9-44b4-acb3-19d47679f872.png">
  <br>
  <br>
  <img width="359" alt="Screen Shot 2022-12-16 at 13 20 43" src="https://user-images.githubusercontent.com/28186870/208035364-39ccf127-cb91-4230-9014-ef84d326a665.png">
  <br>
  <br>

- If the app does not change network automatically, you can change it manually by clicking on the network name on the top right corner of Metamask.

**Reset metamask account**

- If you restart your local Hardhat instance, Metamask will raise a `can not calculate nonce error` and our webapp will be stuck on the loading screen. This is because Metamask does not actively sync how many transactions you have made and only increments it when you make a new transaction. To fix this, you can reset the account. If you are interested in the importance of the `nonce` value, you can read more [here](https://betterprogramming.pub/sending-web3-transactions-in-node-js-nonce-hell-f3ba82edbf3d#:~:text=A%20nonce%20is%20a%20number,(%2B1)%20for%20subsequent%20transactions.).

- If you want to reset the account, you can click on the account name on the top right corner of Metamask.

- Setting > Advance > Reset Account > Reset.
  <br><br><img width="359" alt="Screen Shot 2022-12-19 at 10 48 35" src="https://user-images.githubusercontent.com/28186870/208344031-6b6136c2-b752-4c9a-a624-91cacbc9210f.png">
  <br><br>
- Then you are good to go.

**Joining the game**

- Click on connect button.
- Approve the connection.
- Click on join button.
- Approve the transaction.

**Add new env file**

- The bash script `change-env.sh` will responsible for copying the content of the env file to the `.env` file.
- To run the bash:
  ```
    bash change-env.sh fuji (or hardhat)
  ```
- Currently it only support `hardhat` and `fuji` as argument.
- If you want to add a new env file, you can add the condition code to the `change-env.sh` file.
