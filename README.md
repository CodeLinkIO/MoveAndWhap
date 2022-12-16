# Move And Whap (MaW)

A game demo showcasing how to build a simple, multiplayer game where all user actions are on-chain. Game engine is [PixiJS](https://pixijs.com/)

## Description

This game demo was made to help developers understand how to code a web3 game on an EVM chain, in this case Avalanche. The rules of the game are quite simple. All moves are on chain moves. Players can move up, down, left, and right. The contract board is 2^256 x 2^256 spaces. If you get to the edge of the board it wraps around. However that is rather unlikely.

You can attack a player if you are adjacent, facing them, AND they are not facing you. On the frontend, there is a red boarder. Normal players using the provided frontend can not travel outside of the red border but bots, people who make their own frontend, or anyone directly interacting with the contract can. 

The red boarder exists for simplicity, but it also denotes the spawn zone on the contract. When a player enters the game, they can spawn anywhere in the 256x256 center of the map. All players, regardless of frontend or other custom implementations, must spawn within this zone. You can modify the *join* function on the contract if you want to make multiple join locations or expand or shrink the current one. Or, as long as it is within the -128,127 range, you can modify the frontend to have multiple spawn areas within the main spawn zone.

### Game Contract Logic Recap

- Players can join anywhere within the -128,127 for x and y.
- Players can move North (0), East (1), South (2), and West (3) one space.
- Players can move all the way to 2^256-1 before wrapping around to the other side.
    - This is likely will never happen based on how long a block takes to confirm. Because of this, the board is effectively infinite.
- Players can attack adjacent victims if the player is facing them and the victim is not facing the player.
- You must rejoin after you die.

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

## Game Design Comments

One of the biggest issues with this game is the fact that you have to confirm every move. This is the nature of blockchain. Anything tracked on the blockchain must but be verified by the smart contract, this requires a signature and a gas fee. However, you don't necessarily need to track every single move a player makes. You can centralize some aspects that may not be economically important. The point of decentralization should be to protect a player's assets and the point of crypto currencies in games should be to monetize their assets or make payments between the dev and player smooth. 

You could centralize all player movements to traditional server based gaming. You could instead keep things like upgrades, game currency balance, item, and land ownership all on chain and things like chat, movement, and combat off chain. It will really depend on your game type. Some games will do fine or maybe even benefit from on chain moves, like board, card, or other turn based games. You'll have to take into consideration what is important to your players and what has value that players may want to monetize.

Remember, the game still has to be fun. So don't get bogged down in decentralizing everything. You could definitely make the appropriate infrastructure and tokenomics to incentivize fully decentralized realtime gaming. But verify your game idea first, then start giving the player what they want. Gamers are tough customers and you don't want to spend too long on a game that doesn't capture their attention. 

Good luck with your dApp.

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