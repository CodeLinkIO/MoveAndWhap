import { EthersService } from "../backend/services/ethersService.mjs";
import { config } from "dotenv";
config();

const service = new EthersService(process.env.PROVIDER_URL);
await service.initialize();
console.log(service.chainId)
console.log(service.chainName)
console.log(service.gasPrice)