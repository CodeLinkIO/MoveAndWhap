import { EthersService } from "./ethersService.mjs";
import { EventTrackingService } from "./eventTrackingService.mjs";
import * as PouchDB from "pouchdb";

class MawServer{
    constructor(mawAddress, providerURL, storagePath) {
        this.chainService = new EthersService(providerURL);
        this.eventService = new EventTrackingService(this.chainService, 2048, 0.1);
        this.contractAddress = mawAddress;
        this.events = [
            "event PlayerJoined(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir)",
            "event PlayerMoved(address indexed player, uint256 indexed x, uint256 indexed y, uint8 dir)",
            "event PlayerAttacked(address indexed attacker, address indexed victim)",
        ];
        
        this.eventTriggers = {}
        let signatures = this.chainService.getTopicIds(this.events);
        this.eventTriggers[signatures[0]] = this.playerJoined;
        this.eventTriggers[signatures[1]] = this.playerMoved;
        this.eventTriggers[signatures[2]] = this.playerAttacked;

        this.storagePath = storagePath
        this.database = new PouchDB(storagePath);
    }

    async startServer() {
    }

    async historicalLoad(startBlock) {
        let blockTxs = this.eventService.getEventsFrom(this.contractAddress, startBlock, 'latest', this.events);
        let filtered = this.eventService.filterBlockTxs(this.events, blockTxs);
        let ordered = this.eventService.orderBlockTxs(filtered);

        for(let t = 0; t < ordered.length; t++){
            let topicSignature = ordered[t].topics[0]
            this.eventIDs[topicSignature](1,2,3,4)
        }
    }

    async playerJoined(address, x, y, dir) {
        let player = await this.database.get(address).catch();
        if(player != undefined) {throw `Player with address ${address} already exists.`;}

        player = {
            _id:address,
            x:x,
            y:y,
            dir:dir
        };
        await this.database.post(player);
    }

    async playerMoved(address, x, y, dir) {
        let player = await this.database.get(address).catch(err => {
            throw `Player with address ${address} does not exist in DB.`; 
        });
        await this.database.remove(player);
        player = {
            _id:address,
            x:x,
            y:y,
            dir:dir
        };
        await this.database.post(player);
    }

    async playerAttacked(victimAddress) {
        let player = await this.database.get(victimAddress).catch(err => {
            throw `Player with address ${victimAddress} does not exist in DB.`; 
        });
        await this.database.remove(player);
    }
}

export {MawServer}
