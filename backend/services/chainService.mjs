class ChainService{

    constructor(providerInfo, ProviderClass) {
        this.provider = new ProviderClass(providerInfo);
    }

    async initialize() {
        try {
            const network = await this.provider.getNetwork().then();
            this.chainId = network["chainId"];
            this.chainName = network["name"];
        } catch (error) {
            console.error(`There was an error initializing the service.\n${error}`);
        }

        try { this.gasPrice = await this.provider.getGasPrice().then(price => parseInt(price)) } 
        catch(error) { console.error(`There was an error fetching the gas price in initilialization.\n${error}`); }
    }
}

export { ChainService }