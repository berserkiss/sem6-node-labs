const rpcws = require('rpc-websockets').Server;

let server = new rpcws({ port: 4000, host: 'localhost' });

server.setAuth(({ login, password }) => login === 'anna' && password === 'berserkiss');


server.register('sum', (params) => {
    let sum = 0;
    for (let i = 0; i < params.length; i++) {
        if (Number.isInteger(params[i])) {
            sum += params[i];
        }
    }
    return sum;
}).public();

server.register('mul', (params) => {
    let mul = 1;
    for (let i = 0; i < params.length; i++) {
        if (Number.isInteger(params[i])) {
            mul *= params[i];
        }
    }
    return mul;
}).public();

server.register('square', (params) => {
    return params.length === 2 ? params[0] * params[1] : Math.PI * (Math.pow(params[0], 2));
}).public();


server.register('fact', (params) => {
    if (params.length !== 1 || !Number.isInteger(params[0]) || params[0] < 0) {
        throw new Error('fact: требуется один положительный целый параметр');
    }
    return factorial(params[0]);
}).protected();

server.register('fib', (params) => {
    if (params.length !== 1 || !Number.isInteger(params[0]) || params[0] <= 0) {
        throw new Error('fib: требуется один положительный целый параметр');
    }
    return fibonacci(params[0]);
}).protected();

// Функция факториала
function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Функция Фибоначчи
function fibonacci(n) {
    if (n <= 0) {
        throw new Error('Число должно быть положительным');
    }
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        let temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

