require('dotenv').config();
const bot = require('./src/bot');

// Launch bot
bot.launch();

console.log('🤖 ASTRALIS RPG Bot is running!');
console.log('Database: ./astralis.db');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
