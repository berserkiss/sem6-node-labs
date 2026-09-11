const WebSocket = require('ws');
const fs = require('fs');

const path = './test.txt';

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Подключен к серверу');


    const fileStream = fs.createReadStream(path);

    fileStream.on('data', chunk => {
        ws.send(chunk);
    });

    fileStream.on('end', () => {
        console.log('Файл отправлен');
        ws.close();
    });
});

ws.on('error', err => console.error('Ошибка:', err));
ws.on('close', () => console.log('Соединение закрыто'));
