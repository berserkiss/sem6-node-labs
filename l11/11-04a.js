const WebSocket = require('ws');
const process = require('process');


if (process.argv.length < 3) {
    console.log('Пожалуйста, передайте имя клиента как параметр командной строки');
    process.exit(1);
}

const clientName = process.argv[2];

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Подключено к серверу');


    const timestamp = Date.now();
    const message = {
        client: clientName,
        timestamp: timestamp
    };

    ws.send(JSON.stringify(message));
});

ws.on('message', (data) => {
    const response = JSON.parse(data);
    console.log('Сообщение от сервера:', response);
});

ws.on('error', (err) => {
    console.error('Ошибка соединения:', err);
});

ws.on('close', () => {
    console.log('Соединение с сервером закрыто');
});
