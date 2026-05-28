const { getHero, updateHero } = require('../db/heroes');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  try {
    const hero = await getHero(userId);
    if (!hero) {
      return ctx.reply('❌ You need to create a hero first! /create');
    }

    const lastCollect = hero.lastCollectTime || 0;
    const now = Date.now();
    const timeSinceLastCollect = now - lastCollect;
    const collectCooldown = 60 * 60 * 1000; // 1 hour

    if (timeSinceLastCollect < collectCooldown) {
      const minutesLeft = Math.ceil((collectCooldown - timeSinceLastCollect) / (60 * 1000));
      return ctx.reply(
        `⏰ You just collected!\n\nCome back in ${minutesLeft} minutes.`
      );
    }

    const collectAmount = 100 + Math.floor(hero.level * 50);

    await updateHero(userId, {
      gold: hero.gold + collectAmount,
      lastCollectTime: now
    });

    await ctx.reply(
      `💰 *COLLECTED REWARDS!*\n\n` +
      `+${collectAmount} 🪙 Gold\n\n` +
      `Next collection in 1 hour!`
    );
  } catch (error) {
    console.error('[collect]', error);
    await ctx.reply('❌ Error collecting rewards');
  }
};
