import { providers, utils } from "ethers";
import { ChainService } from "./chainService.mjs";

class EthersService extends ChainService{

    constructor(providerUrl) {
        let provider = new providers.JsonRpcProvider(providerUrl);
        super(provider);
    }

    async getLogs(filter) { return await this.provider.getLogs(filter).then(); }
    async getHeight() { return await this.provider.getBlockNumber().then(); }
    
    getTopicIds(topics) {
        let ids = [];
        for(let t = 0; t < topics.length; t++){ 
            ids.push(utils.id(topics[t])); 
        }
        return ids;
    }
}

export { EthersService }