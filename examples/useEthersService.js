import { EthersService} from "../backend/services/ethersService.js";
import { config } from "dotenv";
config();

async function makeService () {
    const service = new EthersService(process.env.PROVIDER_URL);
    await service.initialize()
}

makeService()