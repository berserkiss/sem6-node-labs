const WebSocket = require('ws');


const ws = new WebSocket('ws://localhost:4000');


ws.on('open', () => {
    console.log('Подключено к серверу');
});


ws.on('message', (message) => {
    if (Buffer.isBuffer(message)) {
        console.log('Получено бинарное сообщение:', message.toString('utf-8')); // Преобразуем обратно в строку
    } else {
        console.log('Сообщение от сервера:', message);
    }

});


ws.on('ping', () => {
    console.log('Получен ping от сервера');
    ws.pong();
});


ws.on('error', (err) => {
    console.error('Ошибка соединения:', err);
});


ws.on('close', () => {
    console.log('Соединение закрыто');
});
