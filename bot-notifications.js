// Bot Notification Integration
// This module integrates the notification system and scheduler with the main bot

require('dotenv').config();
const { Telegraf } = require('telegraf');
const Database = require('better-sqlite3');
const path = require('path');
const NotificationManager = require('./notifications');
const GameScheduler = require('./scheduler');

// Initialize
const BOT_TOKEN = process.env.BOT_TOKEN;
const NOTIFICATION_CHANNEL_ID = process.env.NOTIFICATION_CHANNEL_ID || '-1001234567890'; // Default test channel
const db = new Database(path.join(__dirname, 'astralis.db'));
const bot = new Telegraf(BOT_TOKEN);

// Initialize notification manager
const notificationManager = new NotificationManager(db, bot);

// Initialize scheduler with burn report frequency
const scheduler = new GameScheduler(bot, notificationManager, NOTIFICATION_CHANNEL_ID);

// Example: Call these functions when game events occur

/**
 * Call when a new player joins
 * @param {number} userId - Telegram user ID
 * @param {string} username - Player username
 * @param {string} class_ - Character class
 */
function onNewPlayer(userId, username, class_) {
  console.log(`[v0] New player event: ${username} (${class_})`);
  notificationManager.logNewPlayer(userId, username, class_);
  notificationManager.subscribe(userId, username); // Auto-subscribe to notifications
}

/**
 * Call when a player levels up
 * @param {number} userId - Telegram user ID
 * @param {string} username - Player username
 * @param {number} newLevel - New level
 */
function onLevelUp(userId, username, newLevel) {
  console.log(`[v0] Level up event: ${username} -> Level ${newLevel}`);
  notificationManager.logLevelUp(userId, username, newLevel);
}

/**
 * Call when a PvP battle occurs
 * @param {number} winnerId - Winner's user ID
 * @param {string} winnerName - Winner's username
 * @param {number} loserId - Loser's user ID
 * @param {string} loserName - Loser's username
 * @param {number} magicWon - Tokens won
 */
function onPvPBattle(winnerId, winnerName, loserId, loserName, magicWon) {
  console.log(
    `[v0] PvP battle: ${winnerName} defeated ${loserName} (+${magicWon})`
  );
  notificationManager.logPvPBattle(winnerId, winnerName, loserId, loserName, magicWon);
}

/**
 * Call when tokens are burned
 * @param {number} userId - Telegram user ID
 * @param {string} username - Player username
 * @param {number} amount - Amount burned
 * @param {number} missionId - Mission ID (optional)
 */
function onTokenBurn(userId, username, amount, missionId = null) {
  console.log(`[v0] Token burn: ${username} burned ${amount}`);
  notificationManager.logBurn(userId, username, amount, missionId);
}

/**
 * Call for marketplace activity
 * @param {number} userId - Trader's user ID
 * @param {string} username - Trader's username
 * @param {string} itemName - Item name
 * @param {string} action - 'listed' or 'bought'
 * @param {number} price - Item price
 */
function onMarketplaceActivity(userId, username, itemName, action, price) {
  console.log(
    `[v0] Marketplace activity: ${username} ${action} ${itemName} for ${price}`
  );
  notificationManager.logMarketplace(userId, username, itemName, action, price);
}

/**
 * Call for guild events
 * @param {number} guildId - Guild ID
 * @param {string} guildName - Guild name
 * @param {string} event - Event type (e.g., 'defeated raid boss')
 * @param {string} details - Event details
 */
function onGuildEvent(guildId, guildName, event, details) {
  console.log(`[v0] Guild event: ${guildName} - ${event}`);
  notificationManager.logGuildEvent(guildId, guildName, event, details);
}

/**
 * Call when mission is completed
 * @param {number} userId - Telegram user ID
 * @param {string} username - Player username
 * @param {string} difficulty - Mission difficulty
 * @param {number} reward - Tokens earned
 */
function onMissionCompletion(userId, username, difficulty, reward) {
  console.log(`[v0] Mission completed: ${username} (${difficulty})`);
  notificationManager.logMissionCompletion(userId, username, difficulty, reward);
}

/**
 * Send daily burn report
 * @param {number} chatId - Chat/Channel ID to send to
 */
async function sendBurnReport(chatId = NOTIFICATION_CHANNEL_ID) {
  console.log(`[v0] Sending burn report to ${chatId}`);
  await notificationManager.sendDailyBurnReport(chatId);
}

/**
 * Get recent notifications for dashboard
 * @param {number} limit - Number of notifications to return
 */
function getRecentNotifications(limit = 20) {
  return notificationManager.getRecentNotifications(limit);
}

/**
 * Get daily burn statistics
 */
function getDailyBurnStats() {
  return notificationManager.getTodayBurnStats();
}

/**
 * Get burn report for specified period
 * @param {number} days - Number of days to include
 */
function getBurnReport(days = 7) {
  return notificationManager.getDailyBurnReport(days);
}

/**
 * Subscribe user to notifications
 */
function subscribeToNotifications(userId, username) {
  notificationManager.subscribe(userId, username);
  console.log(`[v0] ${username} subscribed to notifications`);
}

/**
 * Unsubscribe user from notifications
 */
function unsubscribeFromNotifications(userId) {
  notificationManager.unsubscribe(userId);
  console.log(`[v0] User ${userId} unsubscribed from notifications`);
}

// Bot command to subscribe to notifications
bot.command('subscribe', (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;

  subscribeToNotifications(userId, username);

  ctx.reply(
    '🔔 You are now subscribed to ASTRALIS game notifications! ' +
      'You will receive updates about new players, level ups, PvP battles, and more.'
  );
});

// Bot command to unsubscribe
bot.command('unsubscribe', (ctx) => {
  const userId = ctx.from.id;

  unsubscribeFromNotifications(userId);

  ctx.reply(
    '🔕 You have been unsubscribed from notifications. ' +
      'Use /subscribe to re-enable notifications.'
  );
});

// Bot command to view burn report
bot.command('burnreport', async (ctx) => {
  try {
    const stats = getDailyBurnStats();
    const message = `
🔥 *Daily Burn Report*

📊 Today's Statistics:
• Total Burned: ${stats.total_burned.toLocaleString()} tokens
• Players Burning: ${stats.player_count}
• Average per Player: ${Math.round(stats.total_burned / (stats.player_count || 1)).toLocaleString()} tokens
    `.trim();

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('[v0] Error in burnreport command:', error);
    ctx.reply('❌ Error fetching burn report. Please try again later.');
  }
});

// Export functions for use in main bot
module.exports = {
  notificationManager,
  scheduler,
  onNewPlayer,
  onLevelUp,
  onPvPBattle,
  onTokenBurn,
  onMarketplaceActivity,
  onGuildEvent,
  onMissionCompletion,
  sendBurnReport,
  getRecentNotifications,
  getDailyBurnStats,
  getBurnReport,
  subscribeToNotifications,
  unsubscribeFromNotifications,
  bot,
  db,
};

// Initialize bot if this is run directly
if (require.main === module) {
  bot.launch();
  console.log('[v0] Bot started with notification system active');
}
