const rpcws = require('rpc-websockets').Client;

let ws = new rpcws('ws://localhost:4000');

ws.on('open', () => {
    console.log('Подключено к серверу');

    ws.subscribe('C');
});


ws.on('C', (data) => {
    console.log('Событие C получено:', data);
});
