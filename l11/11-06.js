const rpcws = require('rpc-websockets').Server;
let server = new rpcws({port: 4000, host: 'localhost'});

server.event('A');
server.event('B');
server.event('C');

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let data = null;
    while ((data = process.stdin.read()) != null) {
        switch (data.trim().toUpperCase()) {
            case 'A':
                server.emit('A', 'Событие A произошло');
                break;
            case 'B':
                server.emit('B', 'Событие B произошло');
                break;
            case 'C':
                server.emit('C', 'Событие C произошло');
                break;
        }
    }
});

server.on('A', (data) => {
    console.log('Событие A получено:', data);
});
server.on('B', (data) => {
    console.log('Событие B получено:', data);
});
server.on('C', (data) => {
    console.log('Событие C получено:', data);
});

console.log('Сервер запущен и слушает порт 4000');
