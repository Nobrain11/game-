// scheduler.js - Fixed: uses real DB data for burn reports

const cron = require('node-cron');
const tokenomics = require('./src/game/tokenomics');

class GameScheduler {
  constructor(bot, channelId) {
    this.bot = bot;
    this.channelId = channelId;
    this.jobs = [];
    this.initSchedules();
  }

  initSchedules() {
    this.scheduleBurnReport('0 8 * * *', 'Morning');
    this.scheduleBurnReport('0 12 * * *', 'Noon');
    this.scheduleBurnReport('0 20 * * *', 'Evening');
    console.log('[scheduler] Initialized with 3 burn report jobs');
  }

  scheduleBurnReport(cronExpression, timeOfDay) {
    const job = cron.schedule(cronExpression, async () => {
      console.log(`[scheduler] ${timeOfDay} burn report at ${new Date().toISOString()}`);
      try {
        const message = this.buildBurnReport(timeOfDay);
        if (this.channelId) {
          await this.bot.telegram.sendMessage(this.channelId, message, { parse_mode: 'HTML' });
        }
      } catch (error) {
        console.error(`[scheduler] Error sending ${timeOfDay} burn report:`, error);
      }
    });
    this.jobs.push(job);
  }

  buildBurnReport(timeOfDay) {
    const stats       = tokenomics.getTodayBurnStats();
    const weeklyTotal = tokenomics.getWeeklyTotal();
    const allTime     = tokenomics.getAllTimeTotal();
    const buyback     = tokenomics.getTotalBuybackAllocated();
    const topBurners  = tokenomics.getTopBurners(5, 'today');

    const avg = stats.player_count > 0
      ? Math.round(stats.total_burned / stats.player_count)
      : 0;

    let msg =
      `<b>🔥 ${timeOfDay.toUpperCase()} BURN REPORT 🔥</b>\n\n` +
      `<b>📊 Today:</b>\n` +
      `• Burned: <b>${stats.total_burned.toLocaleString()}</b> $MAGIC\n` +
      `• Players: ${stats.player_count}\n` +
      `• Avg per player: ${avg.toLocaleString()} $MAGIC\n\n` +
      `<b>📈 Weekly burned:</b> ${weeklyTotal.toLocaleString()} $MAGIC\n` +
      `<b>🔄 Total buyback pool:</b> ${buyback.toLocaleString()} $MAGIC\n` +
      `<b>💀 All-time burned:</b> ${allTime.toLocaleString()} $MAGIC`;

    if (topBurners.length > 0) {
      msg += '\n\n<b>🏆 Top Burners Today:</b>\n';
      topBurners.forEach((b, i) => {
        const medal = ['🥇','🥈','🥉'][i] || '•';
        msg += `${medal} ${b.username} — ${b.amount.toLocaleString()} $MAGIC\n`;
      });
    }

    msg += '\n\n<i>Keep burning and building the ASTRALIS economy!</i>';
    return msg;
  }

  stopAll() {
    this.jobs.forEach(j => { j.stop(); j.destroy(); });
    console.log('[scheduler] All jobs stopped');
  }
}

module.exports = GameScheduler;
