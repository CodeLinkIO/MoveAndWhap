# Move And Whap (MaW)

A game demo showcasing how to build a simple, multiplayer game where all user actions are on-chain. The game is playable and running [here](https://move-and-whap.netlify.app/), with plans to implement the game on a subnet. 

## Description

This game demo was made to help developers understand how to program a web3 game on an EVM chain, in this case Avalanche. The rules of the game are quite simple. All moves are on chain moves. Players can move up, down, left, and right. The contract board is 2^256 x 2^256 spaces. If you get to the edge of the board it wraps around. However that is rather unlikely.

You can attack a player if you are adjacent, facing them, AND they are not facing you. On the frontend, there is a red boarder. Normal players using the provided frontend can not travel outside of the red border but bots, people who make their own frontend, or anyone directly interacting with the contract can.

The red boarder exists for simplicity, but it also denotes the spawn zone on the contract. When a player enters the game, they can spawn anywhere in the 256x256 center of the map. All players, regardless of frontend or other custom implementations, must spawn within this zone. You can modify the _join_ function on the contract if you want to make multiple join locations or expand or shrink the current one. Or, as long as it is within the -128,127 range, you can modify the frontend to have multiple spawn areas within the main spawn zone.

#### Game Contract Logic Recap

- Players can join anywhere within the -128,127 for x and y.
- Players can move North (0), East (1), South (2), and West (3) one space.
- Players can move all the way to 2^256-1 before wrapping around to the other side.
  - This likely will never happen based on how long a block takes to confirm. Because of this, the board is effectively infinite.
- Players can attack adjacent victims if the player is facing them and the victim is not facing the player.
- You must rejoin after you die.

<br>

## Getting Started

### Mile High View

There are several pieces to this project, primarily **backend** and **webapp** which is the frontend. The backend is responsible for monitoring and maintaining an accurate representation of the smart contract state and serving that state to the frontend. In this particular case, the state is just player positional data. This can easily be tracked fully on chain and the player data can be emitted on contract update. So, all our server does is look for event data and update an in-memory database.

The frontend is responsible for interacting with the on-chain contract via a wallet, listening to changes about the state of the contract from the 
MaW server, then dispaying the data as something interesting to viewers. There is some frontend logic that makes sure the user can't make certain moves. Even though the user can't make these moves in the contract and the contract will properly check for and handle it, it's a better experience if your player never has to think about the contract rules and the frontend just implies and enforces them.

This is a simple diagram of the information flow between the different parts of the system.

![MoveAndWhapLayout](https://user-images.githubusercontent.com/19739051/209604148-c276e4e0-d2b3-47b2-8297-9f80ba723d7f.png)

<br>

### Dependencies

- QuickNode Free Account (not needed but recommended)
- NVM
- NPM
- Node 19.0.0

<br>

### Technologies Being Used

This project is pretty light on packages and NPM handles all of them in the backend and Yarn for the frontend. There are a couple of key packages that the project leans on a bit. Here is a list and a short description of how they are used.

- NodeJs
  - All of the backend was designed around NodeJs and its features.
- EthersJs
  - All blockchain scripts are based on EthersJs, but if you were to replace references in EventTrackingService and MawServices, you can change it to Web3Js if you wanted to.
- PouchDb
  - PouchDb is only used in mawServer.msj but MawServices assumes the database being handed to it is a PouchDB object.  If you wish to use a different database you will need to refactor some of the functions that accept PouchDB objects as arguments.
- Hardhat
  - Hardhat is used for all of the local blockchain simulation.
- React
  - React is used for all of the front end development.
- PixiJs
  - PixiJs is responsible for rendering the 2D game graphics.

<br>

### Installing

- It is recommended using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (node version manager) to install Node and NPM
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

<br>

### Hardhat Config

Hardhat has it's own configuration method and you will need to adjust it accordingly.

- In the root of the project, in hardhat.config.js, under networks:
  - In Fuji, add any private keys to the accounts:["private_key...", "one_more...."].
    - You don't need a lot of keys but you do need at least one.
    - Make sure the key is funded. It is the account that deploys the contract so it needs to have a balance. Shouldn't need much.
    - Don't use the one in there, it is fake.
    - **DEFINITELY DO NOT PUSH YOUR HARDHAT CONFIG JS FILE. IF YOU HAVE CONFIGURED IT PROPERLY IT SHOULD HAVE YOUR PRIVATE KEYS IN IT. JUST BECAUSE IT IS ON THE TESTNET DOES NOT MEAN IT IS SAFE. IF YOU HAVE THE PRIVATE KEY TO THE TESTNET, OR EVEN THE LOCAL HARDHAT, YOU HAVE THE KEYS TO THE MAINNET.** 
    - For safety, you can add hardhat.config.js to the git ignore if you plan on using this project as a basis for something.

<br>

### Local (Hardhat) Environment Setup

- In the root of the project, make a file called _.env_
- Add these initial parameters:
  - **PROVIDER_URL**=http://127.0.0.1:8545/
    - Unless you have configured your Hardhat differently, this should be the default port that you can use to communicate with Hardhat.
  - **WS_PORT**=7070
    - This is the Web Socker Server port for the EventTracking service. It is used to feed events to a client.
    - If you end up needing that port, you can change the Web Socket Server port here. There is no particular reason for being 7070.
  - **MAW_START**=0
    - The first block that the contract was deployed on. In this case, 0 since we just started the blockchain.

- For these variables, you will need to launch the environment before you can fill them in. Add them and keep them blank for now.
  - **MAW_CONTRACT_ADDRESS**: The address where the contract was deployed.
  - **PRIVATE_KEY**: A private key to an address you control.
    - This will be used to make automatic moves.
  - **ACCOUNT**: The address to the private key.

#### Launching Hardhat and Deploying the MaW Contract Locally

- In a terminal in the root of the project, start a hardhat node. We've made a simple command you can use:
  - `npm run node`
  - After the node is up and running, there will be several addresses with their private keys. Copy the _Account #0_ address and private key.
    - Use those for **ACCOUNT** and **PRIVATE_KEY** respecitively in the _.env_ file.
    - Import the private key to your MetaMask wallet. This will be the account you can use to join and move your character with.
      - This is obviously not needed in a production environment, your players will join with their own wallet and accounts.
  - In _./examples/randomWalkerAI.mjs_ make sure line 22 - 26 match up with _Account #1 - #5_ private keys. If they don't, replace them.
    - These are used to make moves for random accounts on the network. There doesn't need to be exactly 5 keys, you can have 1 or 2 or 10.
    - You actually don't need to be running the AI, but the world is just an infinite ocean. We suggest that you have at least 1 AI running so you can test the other functionality. The more AI on the map the easier it will be to test.
- Next compile the MAW.sol contract. In a new terminal enter:
  - `npm run compile`
- After it is compiled, deploy it to the local network. We've made a command that deploys this for you. In a new terminal, run this command:
  - `npm run deploy:local`
  - You should see some lines describing the contract and its deployment information. At the very bottom of this information you should see a line that says the following:
    - _creates: '0x5FbDB2315678afecb367f032d93F642f64180aa3',_
    - This is your **MAW_CONTRACT_ADDRESS** and where the contract has been deployed to, add it to your _.env_ file.
  - In the terminal that you started the node with, you should also see some new lines letting you know a contract has been deployed.

#### Running the Backend Locally

- Next we will launch the server. Type the following command in a free terminal:
  - `node ./examples/mawServer.mjs `
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
  - `node ./examples/randomWalkerAI.mjs`
  - You should see a bunch of text notifying you of AI join positions and movements.
- At this point, your local instance and backend is fully setup and you can start playing with it. Head to the [webapp README.md](/webapp/README.md) to launch the front end. 

<br>

### Avalanche Testnet (Fuji) Environment Setup

- In the root of the project, make a file called _.env_
- Add these initial parameters:
  - **PROVIDER_URL**: Your Avalanche provider URL.
    - You can use the Avalanche public RPCs but for the examples you'll need to adjust the EventTrackingService chunkTime to a higher number. In the examples it is set to 0.1 seconds for Quicknode paid service. You'll need to change them to 1-2 second wait times, otherwise you could be banned from the node for 12 hours.
    - You can signup with a Quicknode free account and get 250ms rate limit. We used Quicknode for the entire development of this project.
    - **FUJI**: https://api.avax-test.network/ext/bc/C/rpc
    - **QUICKNODE**: Make sure to add _/ext/bc/C/rpc_ to the end of your Quicknode URL.
  - **WS_PORT**=7070
    - This is the Web Socker Server port for the EventTracking service. It is used to feed events to a client.
    - If you end up needing that port, you can change the Web Socket Server port here. There is no particular reason for being 7070.

- For these variables, you will need to run hardhat and deploy contracts before you can fill them in. Add them and keep them blank for now.
  - **MAW_CONTRACT_ADDRESS**: The address where the contract was deployed.
  - **MAW_START**: The first block that the contract was deployed on.
  - **PRIVATE_KEY**: A private key to an address you control.
    - This will be used to make automatic moves.
  - **ACCOUNT**: The address to the private key.

#### Funding an Account on Fuji

- In the local instance, Hardhat automatically creditted coins to all of the accounts. On the Fuji net, this will not happen for you. In order to deploy the contract you will need to go to a faucet and request funds from the faucet owner. This is an automatic process and only takes a few moments. You'll need this to deploy the contract.
- First, in your MetaMask wallet, make sure you are connected to the Fuji Network.
- Next, navigate to [Avalanche's Testnet Faucet](https://faucet.avax.network/).random
  - If you are interested, you can look at all of the other test coins and networks they support, but keep them at their defaults for this tutorial.
- Connect your wallet, or manually copy one of your account's addresses into the input area that says _Hexidecimal Address (0x...)_.
  - It is good practice to return the coins that you have not used back to the faucet. At the bottom of the page you can see the faucet address. When you are done with your experimentation, make sure you send them back. They have no monetary value so there is no point keeping them. This will reduce any likelihood of having to reset the testnetwork or alter how much the faucet can give out.
- After you have entered your address, click the _"Request 2 AVAX"_ button.
- After waiting a few moments, you should eventually see 2 extra AVAX in your wallet.
- Now that you have the funds, copy the account address and in your _.env_ file, set **ACCOUNT**=whatever_your_account_address_is.
- Next, click the _Account Options_ button (the 3 little vertical dots) and select account details.
- At the bottom of the new window there will be a _Export private key_ button. Click it.
- Type in your password and confirm.
- You should see a private key. Copy it and add it inside your _.env_ file as **PRIVATE_KEY**.
  - **NOTE**: Be careful with this key. It is a signature that will grant any one authority over that account. If you leak it accidently in a repo, share it in a video stream, or hardcode it in web browsers or programs that are served to a user, it could lead attackers to stealing and controlling the funds of the account.

#### Deploying The MaW Contract to Fuji

- Now we can finally deploy the contract to the network.
- In a terminal in the root of the project, compile the MAW.sol contract:
  - `npm run compile`
- After it is compiled, deploy it to the local network. We've made a command that deploys this for you. In a new terminal, run this command:
  - `npm run deploy:fuji`
  - You should see some lines describing the contract and its deployment information. At the very bottom of this information you should see a line that says the following:
    - _creates: '0x5FbDB2315678afecb367f032d93F642f64180aa3',_
    - This is your **MAW_CONTRACT_ADDRESS** and where the contract has been deployed to, add it to your _.env_ file.
  - Navigate to [SnowTrace's Testnet Explorer](https://testnet.snowtrace.io/) to find information on your contract.
    - If you search for your contract address, you will see information about which block it was deployed at and how many transactions there have been for it. 
    - The first transaction (and likely only at this point) will be block it was deployed on. This is the **MAW_START** block, add it to your _.env_ file.
    
#### Running the Backend Locally Using the Fuji Net

- Next we will launch the server. Type the following command in a free terminal:
  - `node ./examples/mawServer.mjs `
  - You should see something similar (maybe not exact) to this:
    ```
    Starting server...
    Initializing chain service.
    Setting up MAW.sol contract at 0x5FbDB2315678afecb367f032d93F642f64180aa3.
    WS Server Created on port '7070'.
    Pulling events from 17190598 to 17190675.
    ```
  - Give it time to sync all of the blocks up until this point. The server is using the EvenTrackingService class we made in this repo to collect all events between the first and latest block. Depending on when you launched it and what the latest block is, it could take a while.
  - It is done syncing when you see a "Listening for live moves."
  - If you want to have AI running on the blockchain, you will have to gather private keys from your wallet, add them to the _./examples/randomWalkerAI.mjs_ script, and send coins to every address. You can do that if you want, but it is not really necessary. The fact that the faucet requires a wait period of 1 day makes that process even more tedious. You can see those bots in action on the local Hardhat instance.
  - At this point though, your contract is live on the network and you can start playing with it. Head to the [webapp README.md](/webapp/README.md) to launch the front end.

<br>

## Subnet Deploy

This section is specifically geared towards deploying contracts on Avalanche Subnets. This document is not intended to educate you on what a subnet is or how they work. While the concept is not too dificult to understand, it is important that you do in fact understand it before you begin experimenting with it. If you don't, you may not understand why some of the steps are needed and if you run into problems you will not be able to troubleshoot them yourself because you are missing key pieces of information. Here is a list of resources you can take a look at before moving on:

- [Horizontal Scaling Quick Overview - John Wu, Ava Labs 12:07-14:00](https://youtu.be/eI70yF1eOnM?t=727)
- [Thorough Overview of Subnets - Giacomo Barbieri, Avascan 41 minutes. (Recommended)](https://www.youtube.com/watch?v=qAkJN0UBgSE&ab_channel=Avalanche)
- [Subnet Overview Documentation](https://docs.avax.network/subnets)
- [Subnet Justification Article](https://docs.avax.network/subnets/when-to-use-subnet-vs-c-chain)

<br>

### Local Subnet Deploy

These instructions are for a Unix environment. If you have been doing this project in Windows up until this point, you'll need to make sure you set up your own WSL environment and then install the necessary prerequisites in the WSL environment as well. These are the install [instructions](https://learn.microsoft.com/en-us/windows/wsl/install) for WSL 1 as well as how to upgrade it to WSL 2. Additionally, Sequence only supports subnets for their paid developer tier, so you will need to make sure you are using Metamask. 

#### Install Avalanche CLI
- Open a terminal.
- Type: `cd ~` if you are not already there.
- Download and run the Avalanche CLI install script.
    - `curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s`
- Depending on your shell, type the following.
    - `export PATH=~/bin:$PATH >> .bashrc` (Ubuntu and WSL)
    - `export PATH=~/bin:$PATH >> .zshrc` (Mac)
- Restart your terminal.
- Test your Avalanche CLI install.
    - `avalanche --version`
    - We've tested this with version `1.0.4`. If you have problems with other versions, please make an issue and let us know with which version you are having the particular issue.

#### Create a Subnet Configuration

- Start the subnet creation process by typing:
    - `avalanche subnet create mawNet`
- An in-terminal menu will prompt you with configuration options:
    - **Choose your VM**:
        - Select `Subnet-EVM`
        - This is an Ethereum based VM and is needed to run contracts like the one we have created.
    - **Enter your subnet's ChainId. It can be any positive integer.**
        - Enter ChainID: `13123`
        - This can be any unique number that is not already taken in the Avalanche ecosystem. For this tutorial just keep this number so you don't accidently forget that you made your own number in down stream instructions.
    - **Select a symbol for your subnet's native token**
        - Enter Token Symbol: `MAW`
        - This is the currency ticker that will show up in your wallet when you connect to it.
    - **What version of Subnet-EVM would you like?**
        - Select `Use latest version`
    - **How would you like to set fees:**
        - Select  `Low disk use / Low Throughput 1.5 mil gas/s (C-Chain's setting)`
        - This, and the other two named options, is a preset that defines the characteristics of your chain.
        - It determines parameters for users and validators. You can play around with them later, but for this tutorial it doesn't really matter. In a real environment though, they will determine transaction speeds, transaction costs, and validator hardware requirements.
    - **How would you like to distribute funds:**
        - Click the down arrow to select `Customize your airdrop`. 
        - **Address to airdrop to:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
            - This is the account you should have imported into your wallet to test in the Hardhat environment.
            - If you did not do that, there are instructions to add it at the end.
        - **Amount to airdrop (in AVAX units):** `10000`
            - This is the same amount hardhat gives to this account, but you can add more.
        - **Would you like to airdrop more tokens?:**
            - Click the down arrow to select `Yes` .
        - Repeat this process for all of these remaining addresses.
            - `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
            - `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
            - `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
            - `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
            - `0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc`
            - These addresses all belong to the private keys in the randomWalkerAI.mjs example.
    - **Advanced:** Would you like to add a custom precompile to modify the EVM?:
        - Select `No`.
    - You have completed a full subnet configuration and you should see the ceremonious text of:
        - `Successfully created subnet configuration`
    - Verify this before deploying the subnet by entering:
        - `avalanche subnet describe mawNet`
        - You should see a bunch of infromation and ascii art regarding the network configuration you just created.

#### Deploy Subnet with Configuration
- Start the local network:
    - `avalanche network start`
    - You should see something like this:
    ```
    Starting previously deployed and stopped snapshot 
    Booting Network. Wait until healthy.
    ```
- Deploy the configuration:
    - `avalanche subnet deploy mawNet`
- An in-terminal menu should have popped up.
    - Choose a network to deploy on:
        - Select `Local Network`
    - You should see something like this:
    ```
    Deploying [mawNet] to Local Network
    VMs ready.
    Blockchain has been deployed. Wait until network acknowledges.
    Network ready to use. Local network node endpoints:
    node2 mawNet http://127.0.0.1:9652/ext/bc/2U4PS9xt9d8RKQxc2TLvcz8XAja1TmvWFmiusgJv1tDfk4Pjvf/rpc
    node3 mawNet http://127.0.0.1:9654/ext/bc/2U4PS9xt9d8RKQxc2TLvcz8XAja1TmvWFmiusgJv1tDfk4Pjvf/rpc
    node4 mawNet http://127.0.0.1:9656/ext/bc/2U4PS9xt9d8RKQxc2TLvcz8XAja1TmvWFmiusgJv1tDfk4Pjvf/rpc
    node5 mawNet http://127.0.0.1:9658/ext/bc/2U4PS9xt9d8RKQxc2TLvcz8XAja1TmvWFmiusgJv1tDfk4Pjvf/rpc
    node1 mawNet http://127.0.0.1:9650/ext/bc/2U4PS9xt9d8RKQxc2TLvcz8XAja1TmvWFmiusgJv1tDfk4Pjvf/rpc
    Browser Extension connection details (any node URL from above works):
    RPC URL:     http://127.0.0.1:9650/ext/bc/2U4PS9xt9d8RKQxc2TLvcz8XAja1TmvWFmiusgJv1tDfk4Pjvf/rpc
    Network name:   mawNet
    Chain ID:     13123
    Currency Symbol: MAW
    ```
- Keep this window open for connection details or copy them into a note pad.

#### Add the Subnet to Your Wallet
- Open your Metamask Wallet.
- Click the account profile icon in the top right.
- Click **Settings**.
- Click **Networks**.
- Click **Add network**.
- At the bottom, click **Add a network manually**.
- Add a network name.
- From your subnet information, add the **RPC URL** to the **New RPC URL** in the network setup.
- In **Chain ID** in the network setup, add `13123`.
- In **Currency Symbol** in the network setup, add `MAW`
- Click **Save**.

#### Import Main Account
- If you haven't already, import the first key we airdropped MAW to.
- Open your Metamask Wallet.
- Click the account profile icon in the top right.
- Click **Import Account**
    - **Enter your private key string here:**
    - Copy and paste: `ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Click **Save**
- You've imported address `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`.
- You should see `10000 MAW` in the account balance.

#### Subnet Environment Setup for MaW Tutorial

You should have a fully deployed subnet at this point, now we need to test it and see the fruits of your labor.
- In the root of the MaW project, in your `hardhat.config.js` under `networks` locate `local_subnet`. This is a config option for hardhat to know which network to deploy contracts to. In your own code you can name it anything you want, but we've named it `local_subnet` and our scripts are using it, so don't change the name of this one.
- For the `url` change the existing one to the same RPC URL you used to setup your Metmask Wallet.
- Under `accounts` make sure it is still `["ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]`
    - You can add as many as you want, but it isn't necessary for this tutorial.
- After this, save `hardhat.config.js`.
- In the `.env` file in the root of this project, change the `PROVIDER_URL` to the same RPC URL you just added to hardhat.config.js.
- Your `.env` file should look like this:
```
PROVIDER_URL="http://127.0.0.1:9656/ext/bc/.../rpc" (RPC URL from your terminal information)
PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
ACCOUNT=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
MAW_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
MAW_START=0
WS_PORT=7070
```
- Save your `.env` file.

#### Deploy and Check Tutorial
In a new terminal, in the root of the MaW project:
- Deploy the contract: `npm run deploy:local_subnet`
- Run the server: `npm run server`
- In another terminal, start the bots: `npm run ai`
- Your server should be running and the AI should be able to make real moves on the subnet. 
- Congratulations, you have deployed a local subnet.
- If you are done and don't want to play around with it anymore make sure to stop everything:
  - In the server terminal, press Ctrl+C or close the terminal.
  - In the AI terminal, press Ctrl+C or close the terminal.
  - In a terminal, to stop the Avalanche network type: `avalanche network stop`.
<br>

## Game Design Comments

One of the biggest issues with this game is the fact that you have to confirm every move. This is the nature of blockchain. Anything tracked on the blockchain must but be verified by the smart contract, this requires a signature and a gas fee. However, you don't necessarily need to track every single move a player makes. You can centralize some aspects that may not be economically important. The point of decentralization should be to protect a player's assets and the point of crypto currencies in games should be to monetize their assets or make payments between the dev and player smooth.

You could centralize all player movements to traditional server based gaming. You could instead keep things like upgrades, game currency balance, item, and land ownership all on chain and things like chat, movement, and combat off chain. It will really depend on your game type. Some games will do fine or maybe even benefit from on chain moves, like board, card, or other turn based games. You'll have to take into consideration what is important to your players and what has value that players may want to monetize.

Remember, the game still has to be fun. So don't get bogged down in decentralizing everything. You could definitely make the appropriate infrastructure and tokenomics to incentivize fully decentralized realtime gaming. But verify your game idea first, then start giving the player what they want. Gamers are tough customers and you don't want to spend too long on a game that doesn't capture their attention.

Good luck with your dApp.

<br>

## Authors

Codie Petersen - [Asteres Technologies LLC](https://www.linkedin.com/company/asteres-technologies)

Loc Le - [huylocit14054](https://github.com/huylocit14054)

CodeLink Limited - [CodeLink.io](https://www.codelink.io/our-team)

<br>

## Version History

- 1.0
  - Initial Release

<br>

## License

This project is licensed under the MIT License - see the MIT-LICENSE.txt file for details

<br>

## Acknowledgments

This game was inspired by two games from [Automonous Worlds](https://autonomousworlds.com/) for their blockchain [Xaya](https://xaya.io).

- [Huntercoin](https://xaya.io/huntercoin)
- [Mover Demo](https://github.com/xaya/xaya_tutorials/wiki/Unity-Mover-Tutorial)
