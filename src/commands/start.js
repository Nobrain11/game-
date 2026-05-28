const heroDb = require('../db/heroes');
const { classSelection } = require('../utils/keyboards');

module.exports = {
  command: 'start',
  handler: async (ctx) => {
    const userId = ctx.from.id;
    let hero = null;

    try {
      hero = heroDb.getHero(userId);
    } catch (err) {
      // Hero doesn't exist yet
    }

    if (hero) {
      // User already has a hero
      await ctx.reply(
        `Welcome back, ${ctx.from.first_name}! 🎮\n\nYour hero is ready for action. Choose what to do:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '👤 Profile', callback_data: 'profile' }, { text: '📊 Stats', callback_data: 'stats' }],
              [{ text: '⚔️ Mission', callback_data: 'mission' }, { text: '🎯 Arena', callback_data: 'arena' }],
              [{ text: '👥 Guild', callback_data: 'guild' }, { text: '🛍️ Market', callback_data: 'market' }],
            ],
          },
        }
      );
    } else {
      // New user - create hero
      await ctx.reply(
        `Welcome to ASTRALIS RPG! 🌟\n\nChoose your hero class to begin your adventure:`,
        classSelection()
      );
    }
  },
};
