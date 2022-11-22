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
        this.storagePath = storagePath
        this.database = new PouchDB(storagePath);
    }

    async startServer() { }

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
