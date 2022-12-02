import { MawServer } from "../backend/services/mawServices.mjs";
import PouchDB from "pouchdb";
import PouchFind from 'pouchdb-find';
import {config} from "dotenv";
config();

//Initialization variables
const serverPort = parseInt(process.env.WS_PORT);
const providerURL = process.env.PROVIDER_URL;
const mawAddress = process.env.MAW_CONTRACT_ADDRESS;
const mawDestination = "./database/MAW";
const startBlock = parseInt(process.env.MAW_START);
const abi = '[{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "attacker","type": "address"},{"indexed": true,"internalType": "address","name": "victim","type": "address"}],"name": "PlayerAttacked","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "player","type": "address"},{"indexed": true,"internalType": "int256","name": "x","type": "int256"},{"indexed": true,"internalType": "int256","name": "y","type": "int256"},{"indexed": false,"internalType": "uint8","name": "dir","type": "uint8"}],"name": "PlayerJoined","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "player","type": "address"},{"indexed": true,"internalType": "int256","name": "x","type": "int256"},{"indexed": true,"internalType": "int256","name": "y","type": "int256"},{"indexed": false,"internalType": "uint8","name": "dir","type": "uint8"}],"name": "PlayerMoved","type": "event"},{"inputs": [{"internalType": "uint8","name": "x","type": "uint8"},{"internalType": "uint8","name": "y","type": "uint8"},{"internalType": "uint8","name": "dir","type": "uint8"}],"name": "join","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint8","name": "dir","type": "uint8"}],"name": "move","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "players","outputs": [{"internalType": "int256","name": "posX","type": "int256"},{"internalType": "int256","name": "posY","type": "int256"},{"internalType": "uint8","name": "direction","type": "uint8"},{"internalType": "bool","name": "isAlive","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "target","type": "address"}],"name": "whap","outputs": [],"stateMutability": "nonpayable","type": "function"}]';

//Database and server object.
//Database only exists in this script, destroys itself when this script is done running.
//If database were a child of mawServer, it would destroy itself once the constructor was done.
PouchDB.plugin(PouchFind);
const database = new PouchDB(mawDestination);
const mawServer = new MawServer(mawAddress, abi, providerURL, mawDestination);

//Start server.
await mawServer.startServer(database, serverPort);
await new Promise(r => setTimeout(r, 1000)); //Hacky server pause to be positive everything is done.
await mawServer.historicalLoad(startBlock, database).then(); //Load all moves from first contract block to now.
await mawServer.listen(database); //Continue to listen to new blocks.