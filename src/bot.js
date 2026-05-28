const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const cooldownMiddleware = require('./middleware/cooldown');

// Database modules
const userDb = require('./db/users');
const heroDb = require('./db/heroes');
const missionEngine = require('./game/missionEngine');
const battleEngine = require('./game/battleEngine');

// Commands
const startCommand = require('./commands/start');
const profileCommand = require('./commands/profile');
const missionCommand = require('./commands/mission');
const createCommand = require('./commands/create');
const battleCommand = require('./commands/battle');
const inventoryCommand = require('./commands/inventory');
const marketCommand = require('./commands/market');
const guildCommand = require('./commands/guild');
const dailyCommand = require('./commands/daily');
const leaderboardCommand = require('./commands/leaderboard');
const upgradeCommand = require('./commands/upgrade');
const collectCommand = require('./commands/collect');
const helpCommand = require('./commands/help');

// Utils
const { formatNumber } = require('./utils/formatters');

if (!config.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required in .env file');
}

const bot = new Telegraf(config.BOT_TOKEN);

// Global middleware
bot.use(authMiddleware);

// Start command
bot.command('start', startCommand);

// Core commands
bot.command('create', createCommand);
bot.command('profile', profileCommand);
bot.command('mission', missionCommand);
bot.command('battle', battleCommand);
bot.command('inventory', inventoryCommand);
bot.command('market', marketCommand);
bot.command('guild', guildCommand);
bot.command('daily', dailyCommand);
bot.command('leaderboard', leaderboardCommand);
bot.command('upgrade', upgradeCommand);
bot.command('collect', collectCommand);
bot.command('help', helpCommand);

// Collect rewards
bot.command('collect', async (ctx) => {
  const userId = ctx.from.id;

  try {
    if (!missionEngine.isMissionComplete(userId)) {
      await ctx.reply('❌ No completed mission to collect!');
      return;
    }

    const rewards = missionEngine.collectMission(userId);
    await ctx.reply(
      `
✅ <b>Mission Complete!</b>

💰 Earned: ${formatNumber(rewards.playerAmount)} tokens
🔥 Burned: ${formatNumber(rewards.burnAmount)} tokens
⭐ XP: +${rewards.xp}

Continue your adventure with /mission!
      `.trim(),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('[v0] Collect error:', error);
    await ctx.reply(`❌ ${error.message}`);
  }
});

// Top players command
bot.command('top', async (ctx) => {
  try {
    const topPlayers = userDb.getTopPlayers(10);
    let message = '<b>🏆 Top 10 Players</b>\n\n';

    topPlayers.forEach((player, i) => {
      message += `${i + 1}. <b>${player.username || 'Player'}</b> - Lvl ${player.level}\n`;
    });

    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('[v0] Top command error:', error);
    await ctx.reply('Error loading leaderboard.');
  }
});

// Help command
bot.command('help', async (ctx) => {
  const helpText = `
<b>🎮 ASTRALIS RPG Commands</b>

<b>Core Commands</b>
/start - Start the game
/profile - View your profile
/mission - Start a new mission
/collect - Claim mission rewards
/top - View leaderboard

<b>Combat</b>
/arena - Enter the PvP arena
/stats - View detailed stats

<b>Guild</b>
/guild - Guild information
/raid - Attack raid boss

<b>Economy</b>
/market - View marketplace
/balance - Check token balance
/burn - View burn statistics

<b>Admin</b>
/help - Show this message
  `.trim();

  await ctx.reply(helpText, { parse_mode: 'HTML' });
});

// Callback query handlers
bot.action(/^class_/, async (ctx) => {
  const userId = ctx.from.id;
  const heroClass = ctx.match[0].replace('class_', '').toUpperCase();

  try {
    const existingHero = heroDb.getHero(userId);
    if (existingHero) {
      await ctx.answerCbQuery('You already have a hero!');
      return;
    }

    const hero = heroDb.createHero(userId, heroClass);
    await ctx.editMessageText(
      `
✨ <b>Hero Created!</b>

Class: <b>${heroClass}</b>
Level: 1
HP: ${hero.hp}

Your adventure begins now! Use /mission to get started.
      `.trim(),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('[v0] Class selection error:', error);
    await ctx.answerCbQuery('Error creating hero. Please try again.');
  }
});

bot.action(/^mission_/, async (ctx) => {
  const difficulty = ctx.match[0].replace('mission_', '').toUpperCase();
  await missionCommand.startMission(ctx, difficulty);
});

bot.action('profile', profileCommand.handler);
bot.action('collect', async (ctx) => {
  // Reuse the collect command handler
  await bot.telegram.sendMessage(ctx.from.id, 'Use /collect to claim rewards');
});

// Error handling
bot.catch((err, ctx) => {
  console.error('[v0] Bot error:', err);
  ctx.reply('❌ An error occurred. Please try again later.');
});

// Start bot
if (process.env.NODE_ENV !== 'production') {
  bot.launch();
  console.log('🤖 Bot is running...');
}

module.exports = bot;
