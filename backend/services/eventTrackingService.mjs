class EventTrackingService{
    constructor(chainService, chunkSize, chunkTime) {
        this.chainService = chainService
        this.chunkSize = chunkSize
        this.chunkTime = chunkTime
    }

    async getEventsFrom(address, start, stop, events) {
        const latest = await this.chainService.getHeight();
        if(start == "latest") { start = latest; }
        if(stop == "latest") { stop = latest; }
        
        let filter = {
            address: address,
            fromBlock: start,
            toBlock: stop,
            eventTopics: this.chainService.getTopicIds(events)
        };

        let blocks = [];
        let remainder = (stop - start) % this.chunkSize;
        if(remainder > 0) {
            filter.toBlock = start+remainder;
            blocks = blocks.concat(await this.chainService.getLogs(filter));
            start += remainder;
        }
        
        let totalChunks = (stop - start)/this.chunkSize;
        for(let c = 0; c < totalChunks; c++)
        {
            filter.start = start;
            filter.stop = start + this.chunkSize;
            blocks = blocks.concat(await this.chainService.getLogs(filter));
        }

        return blocks;
    }

    filterBlockTxs(events, blocks){
        let eventIds = this.chainService.getTopicIds(events);
        let properlyFiltered = [];

        for(let b = 0; b < blocks.length; b++) {
            for(let e = 0; e < eventIds.length; e++) {
                if(blocks[b].topics.includes(eventIds[e])){
                    properlyFiltered.push(blocks[b]);
                }
            }
        }

        return properlyFiltered;
    }
}

export {EventTrackingService}