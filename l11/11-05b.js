const rpcws = require('rpc-websockets').Client;
const async = require('async');


const ws = new rpcws('ws://localhost:4000');


function callRPC(method, params, callback) {
    ws.call(method, params)
        .then((response) => {
            callback(null, `${method}(${params}) → ${response}`);
        })
        .catch((err) => {
            callback(`Ошибка вызова ${method}: ${err.message}`);
        });
}


function auth(callback) {
    ws.login({ login: 'anna', password: 'berserkiss' })
        .then(() => {
            console.log('Авторизация успешна');
            callback(null);
        })
        .catch(err => callback(`Ошибка авторизации: ${err.message}`));
}

ws.on('open', () => {
    console.log('Подключено к WebSocket-серверу');


    async.parallel([
        (callback) => callRPC('square', [3], callback),
        (callback) => callRPC('square', [5, 4], callback),
        (callback) => callRPC('sum', [2], callback),
        (callback) => callRPC('sum', [2, 4, 6, 8, 10], callback),
        (callback) => callRPC('mul', [3], callback),
        (callback) => callRPC('mul', [3, 5, 7, 9, 11, 13], callback)
    ], (err, results) => {
        if (err) {
            console.error(err);
        } else {

            results.forEach(result => console.log(result));
        }


        auth((authErr) => {
            if (authErr) {
                console.error(authErr);
                return;
            }


            async.parallel([
                (callback) => callRPC('fib', [1], callback),
                (callback) => callRPC('fib', [2], callback),
                (callback) => callRPC('fib', [7], callback),
                (callback) => callRPC('fact', [0], callback),
                (callback) => callRPC('fact', [5], callback),
                (callback) => callRPC('fact', [10], callback)
            ], (err, results) => {
                if (err) {
                    console.error(err);
                } else {

                    results.forEach(result => console.log(result));
                }


                setTimeout(() => {
                    ws.close();
                }, 1000);
            });
        });
    });
});
