import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

//You don't necessarily need to provide a private key, but if you don't, you can only
//query the network. You won't be able to make any moves without it.
const service = new EthersService(process.env.PROVIDER_URL, process,env.PRIVATE_KEY);
await service.initialize();
console.log(service.chainId)
console.log(service.chainName)
console.log(service.gasPrice)