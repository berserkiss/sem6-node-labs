const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 4000 });

let messageCount = 0;
let activeConnections = 0;


wss.on('connection', (ws) => {
    activeConnections++;
    console.log(`Клиент подключен. Активных соединений: ${activeConnections}`);


    ws.on('pong', () => {
        console.log('Получен pong от клиента');
    });


    const messageInterval = setInterval(() => {
        messageCount++;
        const message = `11-03-server: ${messageCount}`;
        const buffer = Buffer.from(message, 'utf-8');
        ws.send(buffer);
    }, 15000);


    ws.on('close', () => {
        activeConnections--;
        clearInterval(messageInterval);
        console.log(`Клиент отключен. Активных соединений: ${activeConnections}`);
    });
});


setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.ping();
        }
    });

    console.log(`Активных соединений: ${activeConnections}`);
}, 5000);

console.log('WebSocket сервер слушает на порту 4000');
