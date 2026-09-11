const WebSocket = require('ws');
const fs = require("fs");

if(!fs.existsSync("upload")) {
    fs.mkdirSync("upload");
}

const server = new WebSocket.Server({port: 4000});

server.on('connection', ws => {
    console.log('Клиент подключен');
    const fileStream = fs.createWriteStream(`upload/file_${Date.now()}.txt`);

    ws.on('message', data => fileStream.write(data));
    ws.on('close', () => {
        fileStream.end();
        console.log('Файл сохранен');
    });
});

console.log('WebSocket сервер запущен на порту 4000');