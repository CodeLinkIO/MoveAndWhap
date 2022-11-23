import { BigNumber } from "ethers";
import { EthersService } from "./ethersService.mjs";
import { EventTrackingService } from "./eventTrackingService.mjs";

class MawServer{
    constructor(mawAddress, abi, providerURL, storagePath) {
        this.chainService = new EthersService(providerURL);
        this.eventService = new EventTrackingService(this.chainService, 2048, 0.1);
        this.contractAddress = mawAddress;
        this.contractAbi = abi;
        this.storagePath = storagePath;
        this.mapSize = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        this.mapSize = this.mapSize.div(2);
    }

    async startServer() {
        console.log("Starting server...");
        await this.chainService.initialize().then();
        await this.eventService.setupContract(this.contractAddress, this.contractAbi, false).then();
        this.eventFilters = [
            this.eventService.contract.filters.PlayerJoined(),
            this.eventService.contract.filters.PlayerMoved(),
            this.eventService.contract.filters.PlayerAttacked()
        ];
       
        this.eventSignatures = [
            this.eventFilters[0].topics[0],
            this.eventFilters[1].topics[0],
            this.eventFilters[2].topics[0],
        ]

        this.eventTriggers = {}
        this.eventTriggers[this.eventSignatures[0]] = this.playerJoined;
        this.eventTriggers[this.eventSignatures[1]] = this.playerMoved;
        this.eventTriggers[this.eventSignatures[2]] = this.playerAttacked;
    }

    async historicalLoad(startBlock, database) {
        let blockTxs = await this.eventService.getEventsFrom(startBlock, 'latest', this.eventFilters);
        let filtered = this.eventService.filterBlockTxs(this.eventSignatures, blockTxs);
        let ordered = this.eventService.orderBlockTxs(filtered);
        for(let t = 0; t < ordered.length; t++){
            let topicSignature = ordered[t].topics[0]
            await this.eventTriggers[topicSignature](ordered[t], database).then();
        }
    }

    async playerJoined(log, database) {
        try{
            var player = await database.get(log.args.player);
            throw `Player with address ${log.args.player} already exists.`;
        } catch (error) { if(error.message != "missing") { throw error; } }

        player = {
            _id:log.args.player,
            x:log.args.x.toString(),
            y:log.args.y.toString(),
            dir:log.args.dir
        };
        await database.post(player).then(x => {
            console.log(`Player ${player._id.slice(2,10)} spawned at (${player.x},${player.y}) facing ${player.dir}.`);
        });
    }

    async playerMoved(log, database) {
        let player = await database.get(log.args.player).catch(err => {
            throw `Player with address ${log.args.player} does not exist in DB.`; 
        });
        await database.remove(player);
        player = {
            _id:log.args.player,
            x:log.args.x.toString(),
            y:log.args.y.toString(),
            dir:log.args.dir
        };
        await database.post(player);
        console.log(`Player ${player._id.slice(2,10)} moved ${player.dir}.`)
    }

    async playerAttacked(log, database) {
        let player = await database.get(log.args.victim).catch(err => {
            throw `Player with address ${log.args.victim} does not exist in DB.`; 
        });
        await database.remove(player);
        console.log(`Player ${player._id.slice(2,10)} killed ${log.args.victim}!`);
    }
}

export {MawServer}
