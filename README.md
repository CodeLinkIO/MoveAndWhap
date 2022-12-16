# Move And Whap (MaW)

A game demo showcasing how to build a simple, multiplayer game where all user actions are on-chain. Game engine is [PixiJS](https://pixijs.com/)

## Description

This game demo was made to help developers understand how to code a web3 game on an EVM chain, in this case Avalanche. 

## Getting Started

### Dependencies

- QuickNode account
- nvm 
- npm 
- Node 19.0.0 
- Yarn (version?)

### Installing
- It is recommneded using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (node version manager) to install Node and NPM
- Install Node.js and npm using nvm 
```
nvm install --lts
```
- Install downloads dependencies defined in package.json
```
cd projectroot

npm install
```
- Install Yarn in the webapp directory of the project 
```
cd webapp

npm install yarn
```
### Backend Environment setup

- In the root of the project, make a file called *.env*
- Add these parameters:
    - **PROVIDER_URL**: Your Avalanche provider url.
        - You can use the Avalanche public RPCs but for the examples you'll need to adjust the EventTrackingService chunkTime to a higher number. In the examples it is set to 0.1 seconds for Quicknode paid service. You'll need to change them to 1-2 second wait times, otherwise you could be banned from the node for 12 hours.
        - You can signup with a Quicknode free account and get 250ms rate limit. We used Quicknode for the entire development of this project.
        - **MAINNET**: https://api.avax.network/ext/bc/C/rpc
        - **FUJI**: https://api.avax-test.network/ext/bc/C/rpc
        - **QUICKNODE**: Make sure to add */ext/bc/C/rpc* to the end of your Quicknode url.
    - **PRIVATE_KEY**: A private key to an address you control.
        - This will be used to make automatic moves.
    - **PRIVATE_KEY_ADDRESS**: The address to the private key.
    - **FUJI_URL**: Your Avalanche Fuji Net provider.
        - The Fuji provider url. Specifically used to deploy the contract on the Fuji Network with hardhat. You can use a third party provider or a the public one. There should be no problems with using the public one.
    - **FUJI_DEPLOY_KEY**: A private key of an address on the Fuji Net.
        - This address needs some amount of Avax in it to deploy the contract on the network.
    - **MAW_CONTRACT_ADDRESS**: The address where the contract was deployed.
    - **MAW_START**: The first block that the contract was deployed on.
    - **WS_PORT**=7070
        - This is the Web Socker Server port for the EventTracking service. It is used to feed events to a client.
        - If you end up needing that port, you can change the Web Socket Server port here. There is no particular reason for being 7070.
- Any modifications needed to be made to files/folders

### Launching the Environment

The examples folder is full of scripts made explicitly for the purpose of showing you how to use the *backend/services* scripts. However, the mawServer.mjs script is the only one needed to run the game. This is how you configure and setup the environment before you launch the MAW tracking and web frontend servers.

- First, ensure that your metamask wallet is setup to connect to the hardhat network. Add this network.
    - Network Name: **Hardhat** 
    - New RPC URL: **http://127.0.0.1:8545/**
        - This is also your **PROVIDER_URL** for local deployments.
    - Chain ID : **31337**
    - Currency Symbol: **feth**
- Then start a hardhat node. We've made a simple command you can use. In a terminal, in the root of the project, enter: 
    - ``` npm run node ```
    - After the node is up and running, there will be several addresses with their private keys. Copy the *Account #0* private key and address.
        - Use those for **PRIVATE_KEY** and **PRIVATE_KEY_ADDRESS** respecitively in the *.env* file.
        - Import the private key to your MetaMask wallet. This will be the account you can use to join and move your character with.
    - In *./examples/randomWalkerAI.mjs* make sure line 22 - 26 match up with *Account #1 - #5* private keys. If they don't, replace them.
        - These are used to make moves for random accounts on the network. There can be as many as you want.
- Next compile the MAW.sol contract. In a new terminal enter:
    - ```npm run compile```
- After it is compiled, deploy it to the local network. We've made a command that deploys this for you. In a new terminal, run this command:
    - ```npm run deploy:local```
    - You should see some lines describing the contract and its deployment information. At the very bottom of this information you should see a line that says the following:
        - *creates: '0x5FbDB2315678afecb367f032d93F642f64180aa3',*
        - This is your **MAW_CONTRACT_ADDRESS** and where the contract has been deployed to.
    - In the terminal that you started the node with, you should also see some new lines letting you know a contract has been deployed.
- Now that you have deployed the contract, you will want to find which block the contract was deployed on. This block will be used for **MAW_START**. 
    - We need to know the start block because we don't want to search the entire block history to get the first events of the game. So we supply the server with the first block to cut down on the sync times.
    - For a local deployment of the contract, there is no history, so you can set **MAW_START=0**.
    - For other deployements you can search for the contract address and see what block it was deployed on. For Avalanche you can use snowtrace.io.
- Next we will launch the server. Type the following command in a free terminal:
    - ```node .\examples\mawServer.mjs ```
    - You should see something similar (maybe not exact) to this:
        ```
        Starting server...
        Initializing chain service.
        Setting up MAW.sol contract at 0x5FbDB2315678afecb367f032d93F642f64180aa3.
        WS Server Created on port '7070'.
        Pulling events from 0 to 1.    
        ``` 
    - On other networks, you'll want to make sure you allow a decent amount of sync time before you use it. But on local, it should be loaded fairly quick.
- Next, to make sure everything is running and to populate the world, we'll launch the AI script to see some activity on the MAW server and network. In a new terminal, type in this command:
    - ```node .\examples\randomWalkerAI.mjs```
    - You should see a bunch of text notifying you of AI join positions and movements.
- **LOC TO ADD FRONT END DOCUMENTATION**: 
    - ``` code blocks for commands ```

## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Codie Petersen [Codie-Petersen](https://github.com/Codie-Petersen)

Loc Le [huylocit14054](https://github.com/huylocit14054)


## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

This game was inspired by two games from the [Automonous Worlds.](https://autonomousworlds.com/) for their blockchain [Xaya](https://xaya.io).
- [Hunter Coin](https://xaya.io/huntercoin)
- [Mover Demo](https://github.com/xaya/xaya_tutorials/wiki/Unity-Mover-Tutorial)
