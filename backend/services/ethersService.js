import * as ethers from "ethers"

class EthersService{

    constructor(providerUrl) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    }

    async initialize() {
        try {
            const network = await this.provider.getNetwork(net => { return net; });
            this.chainId = network["chainId"];
            this.chainName = network["name"];
        } catch (error) {
            console.error(`There was an error initializing the service.\n${error}`);
        }

        try { this.gasPrice = this.provider.getGasPrice(price => {return parseInt(price);}) } 
        catch(error) { console.error(`There was an error fetching the gas price in initilialization.\n${error}`); }
    }
}

export { EthersService }