const rpcws = require('rpc-websockets').Client;
const WebSocket = require('ws');

const ws = new rpcws('ws://localhost:4000');

function callRPC(method, params) {
    ws.call(method, params)
        .then((response) => {console.log(`${method}(${params}) → ${response}`);})
        .catch((err) => {console.error(`Ошибка вызова ${method}:`, err.message)});
}

function auth(callback) {
    ws.login({ login: 'anna', password: 'berserkis' })
        .then(() => {
            console.log('Авторизация успешна');
            callback();
        })
        .catch(err => console.error('Ошибка авторизации:', err.message));
}


ws.on('open', () => {
    console.log('Подключено к WebSocket-серверу');


    callRPC('square', [3]);
    callRPC('square', [5, 4]);

    callRPC('sum', [2]);
    callRPC('sum', [2, 4, 6, 8, 10]);

    callRPC('mul', [3]);
    callRPC('mul', [3, 5, 7, 9, 11, 13]);


    auth(() => {
        callRPC('fib', [1]);
        callRPC('fib', [2]);
        callRPC('fib', [7]);

        callRPC('fact', [0]);
        callRPC('fact', [5]);
        callRPC('fact', [10]);


        setTimeout(() => {
            ws.close();
        }, 1000);
    });
});