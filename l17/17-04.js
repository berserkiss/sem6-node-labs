const { createClient } = require('redis');

async function testHashPerformance() {
    const client = createClient({
        url: 'redis://localhost:6379'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    try {
        await client.connect();
        console.log('Connected to Redis server\n');

        // Тестируем HSET операции (старый синтаксис)
        console.time('10,000 HSET operations');
        for (let i = 1; i <= 10000; i++) {
            await client.hSet(`hash:${i}`, 'id', i, 'val', `val-${i}`);
        }
        console.timeEnd('10,000 HSET operations');

        // Тестируем HGETALL операции
        console.time('10,000 HGETALL operations');
        for (let i = 1; i <= 10000; i++) {
            await client.hGetAll(`hash:${i}`);
        }
        console.timeEnd('10,000 HGETALL operations');

        // Очистка
        console.time('Cleanup 10,000 hashes');
        const keys = Array.from({length: 10000}, (_, i) => `hash:${i+1}`);
        await client.del(keys);
        console.timeEnd('Cleanup 10,000 hashes');

    } catch (err) {
        console.error('Error during testing:', err);
    } finally {
        await client.quit();
        console.log('\nConnection closed');
    }
}

testHashPerformance();