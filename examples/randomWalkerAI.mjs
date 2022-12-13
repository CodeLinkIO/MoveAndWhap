import * as ethers from "ethers";
import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

var services = [];
var contracts = [];
const directions = ["north","east","south","west"];
const waitMin = 2000;
const waitMax = 5000;
const mawAbi = [
    "constructor()",
    "function join(int8 x, int8 y, uint8 dir)",
    "function move(uint8 dir)",
    "function whap(address target)",
    "event PlayerJoined(address indexed player, int256 indexed x, int256 indexed y, int8 dir)",
    "event PlayerMoved(address indexed player, int256 indexed x, int256 indexed y, int8 dir)",
    "event PlayerAttacked(address indexed attacker, address indexed victim)",
];
//First 5 private keys from hardhat.
const privateKeys = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"
]
const playerCount = privateKeys.length;

//Populate services and contracts for each private key we have.
for(let i = 0; i < playerCount; i++) {
    services.push(new EthersService(process.env.PROVIDER_URL, privateKeys[i]));
    await services[i].initialize();
    contracts.push(new ethers.Contract(process.env.MAW_CONTRACT_ADDRESS, mawAbi, services[i].signer));
}

//Join all bots.
for(let i = 0; i < playerCount; i++){
    try {
        //Get random spawn zone and direction.
        let rX = parseInt(Math.floor(Math.max(8,Math.random()*16)));
        let rY = parseInt(Math.floor(Math.max(8,Math.random()*16)));
        let rD = parseInt(Math.floor(Math.random()*4));
        console.log(`X: ${rX}, Y: ${rY}, Dir: ${rD}`);
        let response = await contracts[i].join(rX,rY,rD);
        await response.wait().then(x => console.log(`Bot ${i} joined.`));
    } catch(error) {
        console.log(`Bot ${i} couldn't join. Likely already exists within the game or out of funds.`);
        console.error(error);
    }
}

//Random walk all bots. Note, they will likely walk out of the spawn zone given enough time.
while(true) {
    for(let i = 0; i < playerCount; i++){
        try {
            let timeout = Math.max(waitMin,Math.floor(Math.random()*waitMax)); //Get random wait time.
            await new Promise(r => setTimeout(r, timeout));         //Wait
            let randomDirection = Math.floor(Math.random()*4);      //Get a random direction.
            let response = await contracts[i].move(randomDirection); //Do the actual move.
            await response.wait().then(x => console.log(`Bot ${i} moved ${directions[randomDirection]}`));
        } catch(error) {
            console.log(`Bot ${i} couldn't move. Likely dead or out of funds.`);
            console.error(error);
        }
    }
}