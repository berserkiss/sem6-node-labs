const rpcws = require('rpc-websockets').Client;
const async = require('async');  // Убедитесь, что у вас установлена библиотека async

const ws = new rpcws('ws://localhost:4000');


function callRPC(method, params, callback) {
    ws.call(method, params)
        .then(response => callback(null, response))
        .catch(err => callback(err, null));
}


function auth(callback) {
    ws.login({ login: 'anna', password: 'berserkiss' })
        .then(() => {
            console.log('Авторизация успешна');
            callback();
        })
        .catch(err => console.error('Ошибка авторизации:', err.message));
}

ws.on('open', () => {
    console.log('Подключено к WebSocket-серверу');


    async.parallel([
        // square(3)
        (callback) => callRPC('square', [3], callback),
        // square(5, 4)
        (callback) => callRPC('square', [5, 4], callback),
        // Важно пройти аутентификацию перед вызовом fib и mul
        (callback) => auth(() => callRPC('mul', [3, 5, 7, 9, 11, 13], callback)),
        (callback) => auth(() => callRPC('fib', [7], callback)),
        // mul(2, 4, 6)
        (callback) => callRPC('mul', [2, 4, 6], callback)
    ], (err, results) => {
        if (err) {
            console.error('Ошибка выполнения RPC:', err.message);
            return;
        }


        const square3 = results[0];
        const square54 = results[1];
        const mul35791113 = results[2];
        const fib7 = results[3];
        const mul246 = results[4];


        callRPC('sum', [square3, square54, mul35791113], (err, sumResult) => {
            if (err) {
                console.error('Ошибка вызова sum:', err.message);
                return;
            }


            const finalResult = sumResult + fib7 * mul246;


            console.log(`sum(square(3), square(5, 4), mul(3, 5, 7, 9, 11, 13)) = ${sumResult}`);
            console.log(`fib(7) = ${fib7}`);
            console.log(`mul(2, 4, 6) = ${mul246}`);
            console.log(`Результат выражения: ${sumResult} + ${fib7} * ${mul246} = ${finalResult}`);


            setTimeout(() => ws.close(), 1000);
        });
    });
});
