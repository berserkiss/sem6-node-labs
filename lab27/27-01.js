const TelegramBot = require('node-telegram-bot-api');

// Replace with your token
const token = '7650596818:AAGVicRXzdZP5qawkwvbAEzdd_ckcaryM2s';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    // Check if the message is valid text (not a command, photo, etc.)
    if (userMessage) {
        // Send back the echo message
        bot.sendMessage(chatId, `echo: ${userMessage}`);

        // Log the interaction
        console.log(`Echoed message to ${msg.from.username || 'anonymous'}: ${userMessage}`);
    } else {
        // Handle non-text messages
        bot.sendMessage(chatId, "I can only echo text messages!");
    }
});

console.log('Echo bot is running and waiting for messages...');

// Error handling
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code} - ${error.message}`);
});

bot.on('webhook_error', (error) => {
    console.error(`Webhook error: ${error.code} - ${error.message}`);
});