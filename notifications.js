// Notification System for ASTRALIS RPG
// Tracks and manages all game activity notifications and announcements

const fs = require('fs');
const path = require('path');

class NotificationManager {
  constructor(db, bot) {
    this.db = db;
    this.bot = bot;
    this.notificationQueue = [];
    this.subscribers = new Map(); // userId -> subscriber info
    this.initNotificationTable();
  }

  // Initialize notification tracking table
  initNotificationTable() {
    try {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          user_id INTEGER,
          username TEXT,
          action TEXT,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS daily_burns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          report_date DATE UNIQUE,
          total_burned INTEGER DEFAULT 0,
          player_count INTEGER DEFAULT 0,
          top_burner TEXT,
          top_burner_amount INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('[v0] Notification tables initialized');
    } catch (error) {
      console.error('[v0] Error initializing notification tables:', error);
    }
  }

  // Subscribe user to notifications
  subscribe(userId, username) {
    this.subscribers.set(userId, {
      username,
      subscribedAt: new Date(),
      notifications: [],
    });
  }

  // Unsubscribe user
  unsubscribe(userId) {
    this.subscribers.delete(userId);
  }

  // Log new player notification
  logNewPlayer(userId, username, class_) {
    const notification = {
      type: 'new_player',
      user_id: userId,
      username,
      action: `joined as ${class_}`,
      details: `New player created character with class: ${class_}`,
    };

    this.addNotification(notification);
    this.broadcastNotification(
      `🎉 New player joined! ${username} started as ${class_}`
    );
  }

  // Log level up notification
  logLevelUp(userId, username, newLevel) {
    const notification = {
      type: 'level_up',
      user_id: userId,
      username,
      action: `reached level ${newLevel}`,
      details: `Player leveled up to ${newLevel}`,
    };

    this.addNotification(notification);
    this.broadcastNotification(
      `⬆️ ${username} reached Level ${newLevel}!`
    );
  }

  // Log PvP battle result
  logPvPBattle(winnerId, winnerName, loserId, loserName, magicWon) {
    const notification = {
      type: 'pvp_win',
      user_id: winnerId,
      username: winnerName,
      action: `defeated ${loserName}`,
      details: `PvP victory! Won ${magicWon} magic tokens`,
    };

    this.addNotification(notification);
    this.broadcastNotification(
      `⚔️ ${winnerName} defeated ${loserName} in PvP battle! Won ${magicWon} tokens`
    );
  }

  // Log token burn
  logBurn(userId, username, amount, missionId) {
    const notification = {
      type: 'burn',
      user_id: userId,
      username,
      action: `burned ${amount} tokens`,
      details: `Player burned ${amount} tokens in mission ${missionId || 'unknown'}`,
    };

    this.addNotification(notification);
    this.broadcastNotification(
      `🔥 ${username} burned ${amount.toLocaleString()} tokens!`
    );

    // Update daily burn stats
    this.updateDailyBurnStats(userId, amount);
  }

  // Log marketplace activity
  logMarketplace(userId, username, itemName, action, price) {
    const notification = {
      type: 'marketplace',
      user_id: userId,
      username,
      action: `${action} ${itemName}`,
      details: `Marketplace activity: ${action} for ${price} tokens`,
    };

    this.addNotification(notification);
    this.broadcastNotification(
      `🛒 ${username} ${action} ${itemName} for ${price.toLocaleString()} tokens`
    );
  }

  // Log guild event
  logGuildEvent(guildId, guildName, event, details) {
    const notification = {
      type: 'guild_event',
      user_id: guildId,
      username: guildName,
      action: event,
      details,
    };

    this.addNotification(notification);
    this.broadcastNotification(
      `🏰 ${guildName}: ${event} - ${details}`
    );
  }

  // Log mission completion
  logMissionCompletion(userId, username, difficulty, reward) {
    const notification = {
      type: 'mission_complete',
      user_id: userId,
      username,
      action: `completed ${difficulty} mission`,
      details: `Earned ${reward} tokens`,
    };

    this.addNotification(notification);
    this.broadcastNotification(
      `✓ ${username} completed ${difficulty} mission! Earned ${reward} tokens`
    );
  }

  // Add notification to database
  addNotification(notification) {
    try {
      this.db.run(
        `INSERT INTO notifications (type, user_id, username, action, details)
         VALUES (?, ?, ?, ?, ?)`,
        [
          notification.type,
          notification.user_id,
          notification.username,
          notification.action,
          notification.details,
        ]
      );
    } catch (error) {
      console.error('[v0] Error adding notification:', error);
    }
  }

  // Broadcast notification to all subscribers
  broadcastNotification(message) {
    for (const [userId, subscriber] of this.subscribers) {
      this.sendNotification(userId, message).catch((error) => {
        console.error(`[v0] Failed to send notification to ${userId}:`, error);
      });
    }
  }

  // Send individual notification
  async sendNotification(userId, message) {
    try {
      await this.bot.telegram.sendMessage(userId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error(`[v0] Notification send error:`, error.message);
    }
  }

  // Update daily burn statistics
  updateDailyBurnStats(userId, amount) {
    const today = new Date().toISOString().split('T')[0];

    try {
      this.db.run(
        `INSERT INTO daily_burns (report_date, total_burned, player_count)
         VALUES (?, ?, 1)
         ON CONFLICT(report_date) DO UPDATE SET
           total_burned = total_burned + ?,
           player_count = player_count + 1`,
        [today, amount, amount]
      );
    } catch (error) {
      console.error('[v0] Error updating burn stats:', error);
    }
  }

  // Get today's burn statistics
  getTodayBurnStats() {
    const today = new Date().toISOString().split('T')[0];

    try {
      const result = this.db
        .prepare(
          `SELECT total_burned, player_count FROM daily_burns WHERE report_date = ?`
        )
        .get(today);

      return result || { total_burned: 0, player_count: 0 };
    } catch (error) {
      console.error('[v0] Error getting burn stats:', error);
      return { total_burned: 0, player_count: 0 };
    }
  }

  // Get recent notifications
  getRecentNotifications(limit = 20) {
    try {
      return this.db
        .prepare(
          `SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?`
        )
        .all(limit);
    } catch (error) {
      console.error('[v0] Error getting notifications:', error);
      return [];
    }
  }

  // Get daily burn report
  getDailyBurnReport(days = 7) {
    try {
      return this.db
        .prepare(
          `SELECT * FROM daily_burns 
           WHERE report_date >= date('now', '-${days} days')
           ORDER BY report_date DESC`
        )
        .all();
    } catch (error) {
      console.error('[v0] Error getting burn report:', error);
      return [];
    }
  }

  // Send daily burn report to chat
  async sendDailyBurnReport(chatId) {
    try {
      const stats = this.getTodayBurnStats();
      const avgBurn =
        stats.player_count > 0
          ? Math.round(stats.total_burned / stats.player_count)
          : 0;

      const message = `
🔥 *Daily Burn Report* 🔥

📊 *Today's Statistics:*
• Total Burned: ${stats.total_burned.toLocaleString()} tokens
• Players Burning: ${stats.player_count}
• Average per Player: ${avgBurn.toLocaleString()} tokens

🏆 *This Week:*
• Total Burned: ${this.getWeeklyTotal().toLocaleString()} tokens

💰 *All Time:*
• Total Burned: ${this.getAllTimeTotal().toLocaleString()} tokens

*Keep burning and building the ASTRALIS economy!*
      `.trim();

      if (chatId) {
        await this.bot.telegram.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
        });
      }

      return message;
    } catch (error) {
      console.error('[v0] Error sending burn report:', error);
    }
  }

  // Calculate weekly total
  getWeeklyTotal() {
    try {
      const result = this.db
        .prepare(
          `SELECT SUM(total_burned) as total FROM daily_burns 
           WHERE report_date >= date('now', '-7 days')`
        )
        .get();

      return result?.total || 0;
    } catch (error) {
      console.error('[v0] Error getting weekly total:', error);
      return 0;
    }
  }

  // Calculate all-time total
  getAllTimeTotal() {
    try {
      const result = this.db
        .prepare(`SELECT SUM(total_burned) as total FROM daily_burns`)
        .get();

      return result?.total || 0;
    } catch (error) {
      console.error('[v0] Error getting all-time total:', error);
      return 0;
    }
  }
}

module.exports = NotificationManager;
