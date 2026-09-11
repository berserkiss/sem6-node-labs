const fs = require('fs');
const WebSocket = require('ws');
const path = `./example.txt`;

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', ()=>{
    const duplex = WebSocket.createWebSocketStream(ws);
    let wfile = fs.createWriteStream(path);
    duplex.pipe(wfile);
});