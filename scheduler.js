// Scheduler for ASTRALIS RPG
// Manages cron jobs for daily burn reports and game events

const cron = require('node-cron');

class GameScheduler {
  constructor(bot, notificationManager, channelId) {
    this.bot = bot;
    this.notificationManager = notificationManager;
    this.channelId = channelId; // Telegram channel/group ID for announcements
    this.jobs = [];
    this.initSchedules();
  }

  // Initialize all scheduled tasks
  initSchedules() {
    // Burn report at 8:00 AM UTC
    this.scheduleBurnReport('0 8 * * *', 'Morning');

    // Burn report at 12:00 PM UTC (noon)
    this.scheduleBurnReport('0 12 * * *', 'Noon');

    // Burn report at 8:00 PM UTC
    this.scheduleBurnReport('0 20 * * *', 'Evening');

    // Reset daily burns at midnight UTC
    this.scheduleResetDaily('0 0 * * *');

    console.log('[v0] Game scheduler initialized with 4 scheduled tasks');
  }

  // Schedule burn report
  scheduleBurnReport(cronExpression, timeOfDay) {
    const job = cron.schedule(cronExpression, async () => {
      console.log(
        `[v0] Executing ${timeOfDay} burn report at ${new Date().toISOString()}`
      );

      try {
        const stats = this.notificationManager.getTodayBurnStats();
        const weeklyStats = this.notificationManager.getWeeklyTotal();
        const allTimeStats = this.notificationManager.getAllTimeTotal();

        const topBurners = this.getTopBurners(5);

        const message = this.formatBurnReport(
          timeOfDay,
          stats,
          weeklyStats,
          allTimeStats,
          topBurners
        );

        if (this.channelId) {
          await this.bot.telegram.sendMessage(this.channelId, message, {
            parse_mode: 'HTML',
          });
        }

        console.log(`[v0] ${timeOfDay} burn report sent successfully`);
      } catch (error) {
        console.error(`[v0] Error sending ${timeOfDay} burn report:`, error);
      }
    });

    this.jobs.push(job);
  }

  // Schedule daily reset
  scheduleResetDaily(cronExpression) {
    const job = cron.schedule(cronExpression, () => {
      console.log('[v0] Executing daily reset at ' + new Date().toISOString());

      try {
        // Reset can be implemented based on game logic
        // This is a placeholder for future daily reset functionality
        console.log('[v0] Daily reset completed');
      } catch (error) {
        console.error('[v0] Error during daily reset:', error);
      }
    });

    this.jobs.push(job);
  }

  // Format burn report message
  formatBurnReport(timeOfDay, stats, weeklyTotal, allTimeTotal, topBurners) {
    const avgBurn =
      stats.player_count > 0
        ? Math.round(stats.total_burned / stats.player_count)
        : 0;

    let message = `
<b>🔥 ${timeOfDay.toUpperCase()} BURN REPORT 🔥</b>

<b>📊 Today's Statistics:</b>
• <b>Total Burned:</b> ${stats.total_burned.toLocaleString()} tokens
• <b>Players Burning:</b> ${stats.player_count}
• <b>Average per Player:</b> ${avgBurn.toLocaleString()} tokens

<b>📈 Weekly Total:</b> ${weeklyTotal.toLocaleString()} tokens

<b>💰 All Time Total:</b> ${allTimeTotal.toLocaleString()} tokens
    `.trim();

    if (topBurners && topBurners.length > 0) {
      message += '\n\n<b>🏆 Top Burners Today:</b>\n';
      topBurners.forEach((burner, index) => {
        const medal =
          index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '•';
        message += `${medal} <b>#${index + 1}:</b> ${burner.username} - ${burner.amount.toLocaleString()} tokens\n`;
      });
    }

    message += '\n\n<i>Keep burning and building the ASTRALIS economy!</i>';

    return message;
  }

  // Get top burners (placeholder - would need actual data)
  getTopBurners(limit) {
    // This would query the database for top burners today
    // For now, returning mock data
    return [
      { username: 'ShadowKnight', amount: 45000 },
      { username: 'MysticSage', amount: 38000 },
      { username: 'StormBringer', amount: 32000 },
      { username: 'IceWarden', amount: 29000 },
      { username: 'VoidWalker', amount: 25000 },
    ].slice(0, limit);
  }

  // Stop all scheduled tasks
  stopAll() {
    this.jobs.forEach((job) => {
      job.stop();
      job.destroy();
    });
    console.log('[v0] All scheduled tasks stopped');
  }

  // Get job status
  getStatus() {
    return {
      totalJobs: this.jobs.length,
      jobs: this.jobs.map((job, index) => ({
        id: index,
        status: job ? 'running' : 'stopped',
      })),
    };
  }
}

module.exports = GameScheduler;
