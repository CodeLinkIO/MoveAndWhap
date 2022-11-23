import { providers, utils, Wallet } from "ethers";

class EthersService {

    constructor(providerUrl, privateKey=null) {
        this.provider = new providers.JsonRpcProvider(providerUrl);
        if(privateKey != null) { 
            this.signer = new Wallet(privateKey, this.provider); 
            this.address = this.signer.address;
        }
    }

    async initialize() {
        console.log("Initializing chain service.");
        try {
            const network = await this.provider.getNetwork().then();
            this.chainId = network["chainId"];
            this.chainName = network["name"];
        } catch (error) {
            console.error(`There was an error initializing the service.\n${error}`);
        }

        try { this.gasPrice = await this.provider.getGasPrice().then(price => parseInt(price)) } 
        catch(error) { console.error(`There was an error fetching the gas price in initialization.\n${error}`); }
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

    //Send an amount of native coin to another address.
    async transferCoin(toAddress, amount, gasLimit=100000, completionCallback=null) {
        if(this.signer === null){
            console.error("You have not provided a private key therefore there is no signer. \
            You can not send a transaction without a signer.");
            return;
        }
        let transaction = {
            from: this.address,
            to: toAddress,
            value: utils.parseEther(amount),
            nonce: this.provider.getTransactionCount(this.address, 'latest'),
            gasLimit: utils.hexlify(gasLimit),
            gasPrice: this.gasPrice
        };
        if(completionCallback === null) {completionCallback = console.log;}
        try { await this.signer.sendTransaction(transaction).then(tx => completionCallback(tx)); }
        catch(error){ throw `There was an error sending the transaction to ${toAddress}.\n${error}`; }
    }
}


export { EthersService }