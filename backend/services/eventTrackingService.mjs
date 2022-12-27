import ethers from "ethers";

const { Contract } = ethers;

class EventTrackingService {
  constructor(chainService, chunkSize, chunkTime) {
    this.chainService = chainService;
    this.chunkSize = chunkSize; //RPC history limit, Avalanche is 2048, Ethereum is 10000
    this.chunkTime = chunkTime; //How often in seconds you can call the RPC endpoint. Quicknode paid is 100ms
  }

  async setupContract(address, abi, isSigner = true) {
    console.log(`Setting up MAW.sol contract at ${address}.`);
    if (isSigner) {
      this.contract = new Contract(address, abi, this.chainService.signer);
    } else {
      this.contract = new Contract(address, abi, this.chainService.provider);
    }
  }

  //Get event logs from start to stop given a set of filters.
  async getEventsFrom(start, stop, filters) {
    const latest = await this.chainService.getHeight();
    if (start == "latest") {
      start = latest;
    }
    if (stop == "latest") {
      stop = latest;
    }
    console.log(`Pulling events from ${start} to ${stop}.`);

    //Used as temp place holders for chunking.
    let fromBlock = start;
    let toBlock = stop;

    let blocks = [];
    let remainder = (stop - start) % this.chunkSize;
    if (remainder > 0) {
      toBlock = start + remainder;
      //Go through every filter type before we move to the next chunk.
      for (let f = 0; f < filters.length; f++) {
        let filter = filters[f];
        let log = await this.contract
          .queryFilter(filter, fromBlock, toBlock)
          .then((x) => {
            return x;
          });
        blocks = blocks.concat(log);
      }
      start += remainder;
    }

    let totalChunks = (stop - start) / this.chunkSize;
    for (let c = 0; c < totalChunks; c++) {
      fromBlock = start;
      toBlock = start + this.chunkSize;
      //Go through every filter type before we move to the next chunk.
      for (let f = 0; f < filters.length; f++) {
        let filter = filters[f];
        await new Promise((r) => setTimeout(r, this.chunkTime * 1000)); //Don't flood the network.
        let log = await this.contract
          .queryFilter(filter, fromBlock, toBlock)
          .then((x) => {
            return x;
          });
        blocks = blocks.concat(log);
      }
      start = toBlock;
    }

    return blocks;
  }

  //Look for blocks that are duplicates and remove them.
  filterBlockTxs(topicIds, blocks) {
    let properlyFiltered = [];
    let duplicateChecker = {};

    for (let b = 0; b < blocks.length; b++) {
      for (let e = 0; e < topicIds.length; e++) {
        if (blocks[b].topics.includes(topicIds[e])) {
          //Sometimes there are duplicate entries, make sure they aren't added.
          let dupKey = `${blocks[b].blockNumber}-${blocks[b].transactionHash}`;
          if (duplicateChecker[dupKey] !== true) {
            properlyFiltered.push(blocks[b]);
            duplicateChecker[dupKey] = true;
          }
        }
      }
    }

    return properlyFiltered;
  }

  //Sort blocks by blockNumber then transactionIndex.
  orderBlockTxs(blocks) {
    return blocks.sort((a, b) => this.txIsAheadOrBehind(a, b));
  }

  //Callback for sorting.
  //Return 1 if transaction is ahead or -1 if transaction is behind.
  txIsAheadOrBehind(txA, txB) {
    if (txA.blockNumber > txB.blockNumber) {
      return 1;
    } else if (txA.blockNumber == txB.blockNumber) {
      if (txA.transactionIndex > txB.transactionIndex) {
        return 1;
      }
    } else {
      return -1;
    }
  }
}

export { EventTrackingService };
