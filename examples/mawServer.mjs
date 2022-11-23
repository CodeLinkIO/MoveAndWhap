import { MawServer } from "../backend/services/mawServices.mjs";
import PouchDB from "pouchdb";
import {config} from "dotenv";
import {BigNumber} from "ethers";
config();

const providerURL = process.env.PROVIDER_URL;
const privateKey = process.env.PRIVATE_KEY;
const mawAddress = process.env.MAW_CONTRACT_ADDRESS;
const startBlock = parseInt(process.env.MAW_START);
const abi = '[{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "attacker","type": "address"},{"indexed": true,"internalType": "address","name": "victim","type": "address"}],"name": "PlayerAttacked","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "player","type": "address"},{"indexed": true,"internalType": "uint256","name": "x","type": "uint256"},{"indexed": true,"internalType": "uint256","name": "y","type": "uint256"},{"indexed": false,"internalType": "uint8","name": "dir","type": "uint8"}],"name": "PlayerJoined","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "player","type": "address"},{"indexed": true,"internalType": "uint256","name": "x","type": "uint256"},{"indexed": true,"internalType": "uint256","name": "y","type": "uint256"},{"indexed": false,"internalType": "uint8","name": "dir","type": "uint8"}],"name": "PlayerMoved","type": "event"},{"inputs": [{"internalType": "uint8","name": "x","type": "uint8"},{"internalType": "uint8","name": "y","type": "uint8"},{"internalType": "uint8","name": "dir","type": "uint8"}],"name": "join","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint8","name": "dir","type": "uint8"}],"name": "move","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "players","outputs": [{"internalType": "uint256","name": "posX","type": "uint256"},{"internalType": "uint256","name": "posY","type": "uint256"},{"internalType": "uint8","name": "direction","type": "uint8"},{"internalType": "bool","name": "isAlive","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "target","type": "address"}],"name": "whap","outputs": [],"stateMutability": "nonpayable","type": "function"}]'
const database = new PouchDB("./database/MAW");
const mawServer = new MawServer(mawAddress, abi, providerURL, "./database/MAW")
await mawServer.startServer();
await new Promise(r => setTimeout(r, 1000));
await mawServer.historicalLoad(startBlock, database).then();
await mawServer.listener(database);