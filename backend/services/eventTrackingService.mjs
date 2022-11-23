import {Contract} from "ethers";

class EventTrackingService{
    constructor(chainService, chunkSize, chunkTime) {
        this.chainService = chainService
        this.chunkSize = chunkSize
        this.chunkTime = chunkTime
    }

    async setupContract(address, abi, isSigner=true) {
        console.log(`Setting up MAW.sol contract at ${address}.`);
        if(isSigner) { this.contract = new Contract(address, abi, this.chainService.signer); }
        else { this.contract = new Contract(address, abi, this.chainService.provider); }
    }

    async getEventsFrom(start, stop, filters) {
        const latest = await this.chainService.getHeight();
        if(start == "latest") { start = latest; }
        if(stop == "latest") { stop = latest; }
        console.log(`Pulling events from ${start} to ${stop}.`);

        //Used as temp place holders for chunking.
        let fromBlock = start;
        let toBlock = stop;

        let blocks = [];
        let remainder = (stop - start) % this.chunkSize;
        if(remainder > 0) {
            toBlock = start+remainder;
            for(let f = 0; f < filters.length; f++) {
                let filter = filters[f];
                let log = await this.contract.queryFilter(filter, fromBlock, toBlock).then(x => {return x;});
                blocks = blocks.concat(log);
            }
            start += remainder;
        }
        
        let totalChunks = (stop - start)/this.chunkSize;
        for(let c = 0; c < totalChunks; c++)
        {
            fromBlock = start;
            toBlock = start + this.chunkSize;
            for(let f = 0; f < filters.length; f++) {
                let filter = filters[f];
                await new Promise(r => setTimeout(r, this.chunkTime * 1000));
                let log = await this.contract.queryFilter(filter, fromBlock, toBlock).then(x => {return x;});
                blocks = blocks.concat(log);
            }
            start = toBlock;
        }

        return blocks;
    }

    filterBlockTxs(topicIds, blocks){
        let properlyFiltered = [];
        let duplicateChecker = {};

        for(let b = 0; b < blocks.length; b++) {
            for(let e = 0; e < topicIds.length; e++) {
                if(blocks[b].topics.includes(topicIds[e])){
                    //Sometimes there are duplicate entries, make sure they aren't added.
                    let dupKey = `${blocks[b].blockNumber}-${blocks[b].transactionHash}`;
                    if(duplicateChecker[dupKey] !== true) { 
                        properlyFiltered.push(blocks[b]); 
                        duplicateChecker[dupKey] = true;
                    }
                }
            }
        }

        return properlyFiltered;
    }

    orderBlockTxs(blocks) { return blocks.sort((a, b) => this.txIsAheadOrBehind(a,b)); }

    //Callback for sorting.
    //Return 1 if transaction is ahead or -1 if transaction is behind.
    txIsAheadOrBehind(txA, txB){
        if(txA.blockNumber > txB.blockNumber) { return 1; }
        else if(txA.blockNumber == txB.blockNumber){
            if(txA.transactionIndex > txB.transactionIndex) { return 1; }
        }
        else { return -1; }
    }
}

export { EventTrackingService }