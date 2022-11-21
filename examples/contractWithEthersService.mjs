import * as ethers from "ethers";
import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

const service = new EthersService(process.env.PROVIDER_URL, process.env.PRIVATE_KEY);
await service.initialize();

let mawAbi = [
    "constructor()",
    "function join(uint8 x, uint8 y, uint8 dir)",
    "function move(uint8 dir)",
    "function whap(address target)",
    "event PlayerJoined(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir)",
    "event PlayerMoved(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir)",
    "event PlayerAttacked(address indexed attacker, address indexed victim)",
]
let mawContract = new ethers.Contract(process.env.MAW_CONTRACT_ADDRESS, mawAbi, service.signer);
let response = await mawContract.move(0);
let reciept = await response.wait();
console.log(reciept);