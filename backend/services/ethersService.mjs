import { providers } from "ethers";
import { ChainService } from "./chainService.mjs";

class EthersService extends ChainService{

    constructor(providerUrl) {
        super(providerUrl, providers.JsonRpcProvider)
    }
}

export { EthersService }