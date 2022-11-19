import * as ethers from "ethers";

class ContractService{
    constructor(contractInfo, chainService) {
        this.contractInfo = contractInfo;
        this.chainService = chainService;
    }

    async initialize() {

    }
}

export {ContractService}