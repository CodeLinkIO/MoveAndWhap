import * as ethers from "ethers";

class ContractInfo{
    constructor(address, abi) {
        this.address = address;
        this.abi = abi;
    }
}

class ContractService{
    constructor(contractInfo, chainService) {
        this.contractInfo = contractInfo;

        if(chainService.signer === null || chainService.signer == undefined)
        {
            throw `The chain service you have provided does not have a signer initialized. \
            You must provide a chain service that has an initialized signer for contract function interaction.`;
        }

        this.chainService = chainService;
    }

    async initialize() {

    }
}

export { ContractService, ContractInfo }