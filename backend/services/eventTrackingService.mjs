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
            eventTopics: events
        };

        let blocks = [];
        let remainder = (stop - start) % this.chunkSize;
        if(remainder > 0) {
            filter.toBlock = start+remainder;
            blocks.push(await this.chainService.getLogs(filter));
            start += remainder;
        }
        
        let totalChunks = (start - stop)/ this.chunkSize;
        for(let c = 0; c < totalChunks; c++)
        {
            filter.start = start;
            filter.stop = start + this.chunkSize;
            blocks.push(await this.chainService.getLogs(filter));
        }

        return blocks;
    }
}

export {EventTrackingService}