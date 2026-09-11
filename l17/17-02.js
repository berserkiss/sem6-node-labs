const { createClient } = require('redis');
const { promisify } = require('util');

async function testRedisPerformance() {
    // Создаем клиента Redis
    const client = createClient({
        url: 'redis://localhost:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    try {
        // Подключаемся к Redis
        await client.connect();
        console.log('Connected to Redis server\n');

        // Тестируем SET операции
        console.time('10,000 SET operations');
        for (let i = 1; i <= 10000; i++) {
            await client.set(`key${i}`, `value${i}`);
        }
        console.timeEnd('10,000 SET operations');

        // Тестируем GET операции
        console.time('10,000 GET operations');
        for (let i = 1; i <= 10000; i++) {
            await client.get(`key${i}`);
        }
        console.timeEnd('10,000 GET operations');

        // Тестируем DEL операции
        console.time('10,000 DEL operations');
        for (let i = 1; i <= 10000; i++) {
            await client.del(`key${i}`);
        }
        console.timeEnd('10,000 DEL operations');

    } catch (err) {
        console.error('Error during testing:', err);
    } finally {
        // Закрываем соединение
        await client.quit();
        console.log('\nConnection closed');
    }
}

// Запускаем тестирование
testRedisPerformance();