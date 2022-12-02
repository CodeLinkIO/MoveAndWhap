import WebSocket from "ws";

//Connect to websocket server.
const ws = new WebSocket('ws://localhost:7070');

//Listen for messages from the server and log them.
ws.on("message", (data) => { console.log(data.toString()); });

//Wait for 1 second then send the getPlayerStatus command.
await new Promise(r => setTimeout(r, 1000));
ws.send(JSON.stringify({command:"getPlayerStatus"}));

//Wait for 1 second then send the getPlayersWithinRange command and parameters.
await new Promise(r => setTimeout(r, 1000));
ws.send(JSON.stringify({command:"getPlayersInRange", x:0, y:0, range:128}));