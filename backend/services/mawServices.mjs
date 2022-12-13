import { EthersService } from "./ethersService.mjs";
import { EventTrackingService } from "./eventTrackingService.mjs";
import WebSocket, { WebSocketServer } from 'ws';

class MawServer{
    constructor(mawAddress, abi, providerURL, storagePath) {
        this.chainService = new EthersService(providerURL);
        this.eventService = new EventTrackingService(this.chainService, 2048, 0.1);
        this.contractAddress = mawAddress;
        this.contractAbi = abi;
        this.storagePath = storagePath;
    }

    async startServer(database, port) {
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

        //Start web socket server.
        this.createWebSocketServer(database, port);
    }

    //Creates a RPC WS Server which listens for json commands.
    createWebSocketServer(database, port) {
        this.wss = new WebSocketServer({port: port});
        console.log(`WS Server Created on port '${port}'.`)
        this.wss.on('connection', (ws) => {
            console.log("WSS connected to new client.");
            ws.on('message', (data) => {this.recievedMessage(ws, data, database)} );
            let msg = this.formatMessage("connect", "Connected! Welcome to the MAW!!!")
            ws.send(msg);
        });
    }

    //Parses received messages and enacts the command.
    async recievedMessage(client, message, database) {
        //Parse JSON
        try { var json = JSON.parse(message); }
        catch(error) { 
            let errMsg = `Error parsing JSON message: ${message}. ${error}`;
            let msg = this.formatMessage('error', errMsg);
            console.error(errMsg);
            client.send(msg);
            return;
        }

        var msg = null;
        switch(json.command){
            case 'getPlayerStatus':
                const status = await this.getPlayerStatus(json.address, database).then(r => { return r; });
                msg = this.formatMessage('getPlayerStatus',status, json.address);
                client.send(msg);
                break;
            case 'getPlayersInRange':
                try {
                    var x = parseInt(json.x);
                    var y = parseInt(json.y);
                    var range = parseInt(json.range);
                } catch(error) {
                    let errMsg = `There was an error parsing the command: ${json.stringify()} \
                    \nAre all of the parameters integers? \n${error}`;
                    msg = this.formatMessage('error', errMsg, null);
                    console.error(errMsg);
                    client.send(msg);
                    break;
                }
                const players = await this.getPlayersWithinRange(x, y, range, database).then(r => { return r; });
                msg = this.formatMessage('getPlayersInRange', players, null);
                client.send(msg);
                break;
            case 'playerJoined':
                break;
            case 'playerMoved':
                break;
            case 'playerAttacked':
                break;
            case 'error':
                break;
            default:
                let errMsg = `Server does not have command: '${json.command}'`;
                msg = this.formatMessage('error', errMsg, null);
                console.error(errMsg);
                client.send(msg);
                break;
        }
    }

    formatMessage(command, data, address){
        let message = {
            command: command,
            data: data,
            address: address
        }

        return JSON.stringify(message);
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
    async listen(database) {
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
                let data = Object.assign({}, log.args);
                data.x = parseInt(data.x.toString());
                data.y = parseInt(data.y.toString());
                delete data.player;
                this.broadcastEvent('playerJoined', data, player);
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
                let data = Object.assign({}, log.args);
                data.x = parseInt(data.x.toString());
                data.y = parseInt(data.y.toString());
                delete data.player;
                this.broadcastEvent('playerMoved', data, player);
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
                let data = Object.assign({}, log.args);
                this.broadcastEvent('playerAttacked', data, attacker);
            });
    }

    broadcastEvent(eventType, data, address) {
        let msg = this.formatMessage(eventType, data, address);
        this.wss.clients.forEach(
            function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(msg);
            }
        });
    }

    async playerJoined(log, database) {
        //Make sure the player is not in the database.
        try{
            var player = await database.get(log.args.player);
            console.error(`Player with address ${log.args.player} already exists.`);
            return;
        } catch (error) { if(error.message != "missing") { throw error; } }

        player = {
            _id:log.args.player,
            x:parseInt(log.args.x.toString()),
            y:parseInt(log.args.y.toString()),
            dir:log.args.dir
        };

        //Add the player's state to the database.
        await database.put(player).then(x => {
            console.log(`Player ${player._id.slice(2,10)} spawned at (${player.x},${player.y}) facing ${player.dir}.`);
        });
    }

    async playerMoved(log, database) {
        //Make sure the player exists.
        let player = await database.get(log.args.player).catch(err => {
            console.error(`Player with address ${log.args.player} does not exist in DB.`);
            return; 
        });

        //Remove the document so we don't have to make a revision.
        await database.remove(player);
        player = {
            _id:log.args.player,
            x:parseInt(log.args.x.toString()),
            y:parseInt(log.args.y.toString()),
            dir:log.args.dir
        };

        //Add the new version of the player's state in.
        await database.put(player);
        console.log(`Player ${player._id.slice(2,10)} moved ${player.dir}.`)
    }

    async playerAttacked(log, database) {
        //Make sure the player exists.
        let player = await database.get(log.args.victim).catch(err => {
            console.error(`Player with address ${log.args.victim} does not exist in DB.`);
            return;
        });

        //Remove the player.
        await database.remove(player);
        let attacker = log.args.attacker.slice(2,10);
        let victim = log.args.victim.slice(2,10);
        if(attacker == victim) { console.log(`Player ${attacker} killed themself.`); }
        else { console.log(`Player ${attacker} killed ${victim}!`); }
    }

    //Check if player is already in the game or not.
    async getPlayerStatus(address, database) {
        let result = {
            playerLives: false,
            x:0,
            y:0,
            dir:0,
        };

        let player = await database.find({ selector: { _id:address } }).then( p => {
            return p["docs"];
        });

        if(player.length == 0) { return result; }
        
        result = {
            playerLives: true,
            x:player[0].x,
            y:player[0].y,
            dir:player[0].dir
        };
        return result;
    }

    //Get players within certain range.
    async getPlayersWithinRange(x ,y, range, database) {
        let minX = x-range;
        let maxX = x+range;
        let minY = y-range;
        let maxY = y+range;

        let inRange = await database.find({
            selector:{
                $and:[
                    {x: {$gt:minX} },
                    {x: {$lt:maxX} },
                    {y: {$gt:minY} },
                    {y: {$lt:maxY} },
                ]
            }
        }).then(result => { return this.convertDocsToPlayers(result["docs"]); });
        return inRange;
    }

    convertDocsToPlayers(docs){
        let converted = []
        for(let i = 0; i < docs.length; i++){
            let doc = docs[i];
            doc["address"] = doc["_id"];
            delete doc._id;
            delete doc._rev;
            converted.push(doc);
        }
        return converted;
    }
}

export {MawServer}
