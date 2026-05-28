const db = require('../db');

const cooldownMiddleware = (commandName, cooldownSeconds) => {
  return async (ctx, next) => {
    try {
      const userId = ctx.from.id;
      const now = new Date();

      // Check if cooldown exists
      const cooldown = db
        .prepare('SELECT * FROM cooldowns WHERE user_id = ? AND command = ? AND expires_at > ?')
        .get(userId, commandName, now.toISOString());

      if (cooldown) {
        const remaining = Math.ceil((new Date(cooldown.expires_at) - now) / 1000);
        await ctx.reply(`⏳ This command is on cooldown. Try again in ${remaining}s`);
        return;
      }

      // Set new cooldown
      const expiresAt = new Date(now.getTime() + cooldownSeconds * 1000);
      db.prepare('INSERT INTO cooldowns (user_id, command, expires_at) VALUES (?, ?, ?)')
        .run(userId, commandName, expiresAt.toISOString());

      await next();
    } catch (error) {
      console.error('[v0] Cooldown middleware error:', error);
      await ctx.reply('An error occurred. Please try again.');
    }
  };
};

module.exports = cooldownMiddleware;
