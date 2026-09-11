const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000 });

let messageCount = 0;

wss.on('connection', (ws) => {
    console.log('Клиент подключен.');

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            messageCount++;
            const response = {
                server: messageCount,
                client: message.client,
                timestamp: message.timestamp
            };

            ws.send(JSON.stringify(response));  
        } catch (err) {
            console.error('Ошибка обработки сообщения:', err);
        }
    });

    ws.on('close', () => {
        console.log('Клиент отключен.');
    });
});

console.log('WebSocket сервер слушает на порту 4000');
