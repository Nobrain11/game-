const userDb = require('../db/users');

const authMiddleware = async (ctx, next) => {
  try {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Player';

    let user = userDb.getUser(userId);
    if (!user) {
      user = userDb.createUser(userId, username);
      ctx.user = user;
      ctx.isNewUser = true;
    } else {
      ctx.user = user;
      ctx.isNewUser = false;
    }

    await next();
  } catch (error) {
    console.error('[v0] Auth middleware error:', error);
    await ctx.reply('An error occurred. Please try again.');
  }
};

module.exports = authMiddleware;
