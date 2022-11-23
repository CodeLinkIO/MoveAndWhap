import { EthersService } from "./ethersService.mjs";
import { EventTrackingService } from "./eventTrackingService.mjs";

class MawServer{
    constructor(mawAddress, abi, providerURL, storagePath) {
        this.chainService = new EthersService(providerURL);
        this.eventService = new EventTrackingService(this.chainService, 2048, 0.1);
        this.contractAddress = mawAddress;
        this.contractAbi = abi;
        this.storagePath = storagePath;
    }

    async startServer() {
        console.log("Starting server...");
        await this.chainService.initialize().then();
        await this.eventService.setupContract(this.contractAddress, this.contractAbi, false).then();

        //Filters used for looking for events.
        this.eventFilters = [
            this.eventService.contract.filters.PlayerJoined(),
            this.eventService.contract.filters.PlayerMoved(),
            this.eventService.contract.filters.PlayerAttacked()
        ];
        
        //Filter topicIDs used for duplicate filtering.
        this.eventSignatures = [
            this.eventFilters[0].topics[0],
            this.eventFilters[1].topics[0],
            this.eventFilters[2].topics[0],
        ]

        //Functions labelled by their event signatures for easy function referencing.
        this.eventTriggers = {}
        this.eventTriggers[this.eventSignatures[0]] = this.playerJoined;
        this.eventTriggers[this.eventSignatures[1]] = this.playerMoved;
        this.eventTriggers[this.eventSignatures[2]] = this.playerAttacked;
    }

    //Save all event logs since startBlock into the database.
    async historicalLoad(startBlock, database) {
        let blockTxs = await this.eventService.getEventsFrom(startBlock, 'latest', this.eventFilters);
        let filtered = this.eventService.filterBlockTxs(this.eventSignatures, blockTxs);
        let ordered = this.eventService.orderBlockTxs(filtered);

        //For each log, trigger its corresponding function for saving.
        for(let t = 0; t < ordered.length; t++){
            let topicSignature = ordered[t].topics[0]
            await this.eventTriggers[topicSignature](ordered[t], database).then();
        }
    }

    //Listen to the network for all of our events.
    async listener(database) {
        //OnPlayerJoined
        this.eventService.contract.on(this.eventFilters[0], 
            (player, x, y, dir) => {
                let log = {
                    args:{
                        player:player,
                        x:x,
                        y:y,
                        dir:dir,
                    }
                };
                this.playerJoined(log, database);
            });
        
        //OnPlayerMoved
        this.eventService.contract.on(this.eventFilters[1],
            (player, x, y, dir) => {
                let log = {
                    args:{
                        player:player,
                        x:x,
                        y:y,
                        dir:dir,
                    }
                };
                this.playerMoved(log, database);
            });
        
        //OnPlayerAttacked
        this.eventService.contract.on(this.eventFilters[2],
            (attacker, victim) => {
                let log = {
                    args:{
                        attacker: attacker,
                        victim:victim,
                    }
                };
                this.playerAttacked(log, database);
            });
    }

    async playerJoined(log, database) {
        //Make sure the player is not in the database.
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

        //Add the player's state to the database.
        await database.post(player).then(x => {
            console.log(`Player ${player._id.slice(2,10)} spawned at (${player.x},${player.y}) facing ${player.dir}.`);
        });
    }

    async playerMoved(log, database) {
        //Make sure the player exists.
        let player = await database.get(log.args.player).catch(err => {
            throw `Player with address ${log.args.player} does not exist in DB.`; 
        });

        //Remove the document so we don't have to make a revision.
        await database.remove(player);
        player = {
            _id:log.args.player,
            x:log.args.x.toString(),
            y:log.args.y.toString(),
            dir:log.args.dir
        };

        //Add the new version of the player's state in.
        await database.post(player);
        console.log(`Player ${player._id.slice(2,10)} moved ${player.dir}.`)
    }

    async playerAttacked(log, database) {
        //Make sure the player exists.
        let player = await database.get(log.args.victim).catch(err => {
            throw `Player with address ${log.args.victim} does not exist in DB.`; 
        });

        //Remove the player.
        await database.remove(player);
        console.log(`Player ${player._id.slice(2,10)} killed ${log.args.victim}!`);
    }
}

export {MawServer}
