import * as ethers from "ethers"

class EthersService{

    constructor(providerUrl){
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
        this.chainId = provider.getnetwork()
    }
}

export { EthersService }