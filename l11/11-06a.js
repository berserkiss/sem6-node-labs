
const rpcws = require('rpc-websockets').Client;

let ws = new rpcws('ws://localhost:4000');

ws.on('open', () => {
    console.log('Подключено к серверу');
    ws.subscribe('A'); // Подписка на событие A
});

ws.on('A', (data) => {
    console.log('Событие A получено:', data);
});


