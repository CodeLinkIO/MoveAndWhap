import WebSocket from "ws";
import { config } from "dotenv";
config();

//Connect to websocket server.
const ws = new WebSocket(`ws://localhost:${process.env.WS_PORT}`);

//All messages from the service should be in the format {command:"cmd", data:[], address:"0xaddress" }
//These are the possible command terms you can recieve:
//playerJoined, playerMoved, playerAttacked, error, getPlayerStatus, getPlayersInRange

//Listen for messages from the server and log them.
//In your client you would want to make a function that accounts for all versions
//of the message commands.
ws.on("message", (data) => { console.log(data.toString()); });

//Wait for 1 second then send the getPlayerStatus command.
await new Promise(r => setTimeout(r, 1000));
ws.send(JSON.stringify({command:"getPlayerStatus", address: process.env.ACCOUNT}));

//Wait for 1 second then send the getPlayersWithinRange command and parameters.
await new Promise(r => setTimeout(r, 1000));
ws.send(JSON.stringify({command:"getPlayersInRange", x:0, y:0, range:128}));

//Wait for 1 second then send a non existent command to see what errors look like.
await new Promise(r => setTimeout(r, 1000));
ws.send(JSON.stringify({command:"fireTheLasers"}));