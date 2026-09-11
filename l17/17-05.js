const { createClient } = require('redis');

async function runPubSubDemo() {
    // Создаем клиентов для издателя и подписчика
    const publisher = createClient({ url: 'redis://localhost:6379' });
    const subscriber = createClient({ url: 'redis://localhost:6379' });

    // Обработчики ошибок
    publisher.on('error', err => console.log('Publisher error', err));
    subscriber.on('error', err => console.log('Subscriber error', err));

    try {
        // Подключаем клиенты
        await Promise.all([publisher.connect(), subscriber.connect()]);
        console.log('Connected to Redis server');

        // Подписываемся на канал
        await subscriber.subscribe('news', (message, channel) => {
            console.log(`Received message from ${channel}: ${message}`);
        });

        console.log('Subscribed to "news" channel. Waiting for messages...\n');

        // Публикуем сообщения
        let count = 1;
        const interval = setInterval(async () => {
            const msg = `Message ${count}`;
            await publisher.publish('news', msg);
            console.log(`Published: ${msg}`);

            if (count++ === 20) {
                clearInterval(interval);
                console.log('\nFinished publishing. Waiting 2 seconds before exit...');
                setTimeout(async () => {
                    await cleanup();
                }, 2000);
            }
        }, 1000);

    } catch (err) {
        console.error('Pub/Sub error:', err);
        await cleanup();
    }

    async function cleanup() {
        await subscriber.unsubscribe('news');
        await Promise.all([publisher.quit(), subscriber.quit()]);
        console.log('Disconnected from Redis');
        process.exit(0);
    }
}

runPubSubDemo();