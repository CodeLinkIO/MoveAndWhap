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

//Filter for events based on their actual function names and input types.
let events = ["Approval(address,address,uint256)"]
let blockTxs = await trackingService.getEventsFrom(address, start , stop, events);
let filtered = trackingService.filterBlockTxs(events, blockTxs);
console.log(filtered);