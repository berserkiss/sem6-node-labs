const { createClient } = require('redis');

async function testIncrDecrPerformance() {
    // Создаем клиента Redis
    const client = createClient({
        url: 'redis://localhost:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    try {
        // Подключаемся к Redis
        await client.connect();
        console.log('Connected to Redis server\n');

        // Инициализируем ключ для тестирования
        await client.set('counter', '0');
        console.log('Initialized counter with 0\n');

        // Тестируем INCR операции
        console.time('10,000 INCR operations');
        for (let i = 0; i < 10000; i++) {
            await client.incr('counter');
        }
        console.timeEnd('10,000 INCR operations');

        // Проверяем результат
        const afterIncr = await client.get('counter');
        console.log(`Counter after INCR: ${afterIncr}\n`);

        // Тестируем DECR операции
        console.time('10,000 DECR operations');
        for (let i = 0; i < 10000; i++) {
            await client.decr('counter');
        }
        console.timeEnd('10,000 DECR operations');

        // Проверяем результат
        const afterDecr = await client.get('counter');
        console.log(`Counter after DECR: ${afterDecr}\n`);

    } catch (err) {
        console.error('Error during testing:', err);
    } finally {
        // Закрываем соединение
        await client.quit();
        console.log('Connection closed');
    }
}

// Запускаем тестирование
testIncrDecrPerformance();