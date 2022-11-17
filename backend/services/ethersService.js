import * as ethers from "ethers"

class EthersService{

    constructor(providerUrl) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    }

    async initialize() {
        const network = await this.provider.getNetwork(net => { return net; });
        this.chainId = network["chainId"];
        this.chainName = network["name"];
    }
}

export { EthersService }