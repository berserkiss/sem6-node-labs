const rpcws = require('rpc-websockets').Client;

let ws = new rpcws('ws://localhost:4000');

ws.on('open', () => {
    console.log('Подключено к серверу');

    ws.subscribe('B');

});


ws.on('B', (data) => {
    console.log('Событие B получено:', data);
});

