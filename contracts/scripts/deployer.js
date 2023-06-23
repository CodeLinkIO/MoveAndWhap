const hre = require("hardhat");

class DeploymentService{
    constructor(contractNames, contractArguments){
        this.contractNames = contractNames;
        this.contractArguments = contractArguments;
    }

    async deploy() {
        let deployementResults = {};
        for(let n = 0; n < this.contractNames.length; n++) {
            let name = this.contractNames[n];
            console.log(name)
            let args = this.contractArguments[n];
            console.log(args)
            const contract = await hre.ethers.getContractFactory(name);
            deployementResults[name] = await contract.deploy(...args);
        }
        return deployementResults;
    }
}

async function main() {
    const deployer = new DeploymentService(["MAW"], [[]])
    const results = await deployer.deploy().then();
    console.log(JSON.stringify(results));
}

main();