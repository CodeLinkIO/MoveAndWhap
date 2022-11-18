import { EventTrackingService } from "../backend/services/eventTrackingService.mjs";
import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

const chainService = new EthersService(process.env.PROVIDER_URL);
const trackingService = new EventTrackingService(chainService, 2048, 2);

//USDC contract address on Avalanche
let address = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
//Block range with guaranteed transactions in it.
let start = 22510004;
let stop = 22514205;

//Get blocks but don't filter for topic, get them all for that address.
let blocks = await trackingService.getEventsFrom(address, start , stop, []);
console.log(blocks.length);