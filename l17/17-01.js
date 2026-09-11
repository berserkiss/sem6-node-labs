const redis = require('redis');

// Создание клиента Redis
const client = redis.createClient({
    url: 'redis://localhost:6379'
});


client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Проверка соединения
client.on('ready', async () => {
    console.log('Connected to Redis server');

    try {

        const reply = await client.ping();
        console.log('PING response:', reply);
    } catch (err) {
        console.error('PING failed:', err);
    } finally {
        // Закрытие соединения
        await client.quit();
        console.log('Connection closed');
    }
});


client.connect()
    .then(() => console.log('Connecting to Redis...'))
    .catch(err => console.error('Connection failed:', err));

setTimeout(() => {}, 5000);