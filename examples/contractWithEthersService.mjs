import * as ethers from "ethers";
import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

const service = new EthersService(process.env.PROVIDER_URL, process.env.PRIVATE_KEY);
await service.initialize();

// let mawAbi = [
//     "constructor()",
//     "function join(uint8 x, uint8 y, uint8 dir)",
//     "function move(uint8 dir)",
//     "function whap(address target)",
//     "event PlayerJoined(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir)",
//     "event PlayerMoved(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir)",
//     "event PlayerAttacked(address indexed attacker, address indexed victim)",
// ];
let mawAbi = '[{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "attacker","type": "address"},{"indexed": true,"internalType": "address","name": "victim","type": "address"}],"name": "PlayerAttacked","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "player","type": "address"},{"indexed": true,"internalType": "uint256","name": "x","type": "uint256"},{"indexed": true,"internalType": "uint256","name": "y","type": "uint256"},{"indexed": false,"internalType": "uint8","name": "dir","type": "uint8"}],"name": "PlayerJoined","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "player","type": "address"},{"indexed": true,"internalType": "uint256","name": "x","type": "uint256"},{"indexed": true,"internalType": "uint256","name": "y","type": "uint256"},{"indexed": false,"internalType": "uint8","name": "dir","type": "uint8"}],"name": "PlayerMoved","type": "event"},{"inputs": [{"internalType": "uint8","name": "x","type": "uint8"},{"internalType": "uint8","name": "y","type": "uint8"},{"internalType": "uint8","name": "dir","type": "uint8"}],"name": "join","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint8","name": "dir","type": "uint8"}],"name": "move","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "players","outputs": [{"internalType": "uint256","name": "posX","type": "uint256"},{"internalType": "uint256","name": "posY","type": "uint256"},{"internalType": "uint8","name": "direction","type": "uint8"},{"internalType": "bool","name": "isAlive","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "target","type": "address"}],"name": "whap","outputs": [],"stateMutability": "nonpayable","type": "function"}]';
let mawContract = new ethers.Contract(process.env.MAW_CONTRACT_ADDRESS, mawAbi, service.signer);
// let response = await mawContract.join(123,45,0);
// await response.wait().then(x => console.log(x));
for(let m = 0; m < 100; m++) {
    await new Promise(r => setTimeout(r, 2000));
    let response = await mawContract.move(0);
    await response.wait().then(x => console.log(x));
}
