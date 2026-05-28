const { getHero, updateHero } = require('../db/heroes');
const { GAME_CONSTANTS } = require('../config/constants');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  try {
    const hero = await getHero(userId);
    if (!hero) {
      return ctx.reply('❌ You need to create a hero first! /create');
    }

    const lastDaily = hero.lastDailyClaimTime || 0;
    const now = Date.now();
    const timeSinceLastDaily = now - lastDaily;
    const dailyCooldown = 24 * 60 * 60 * 1000; // 24 hours

    if (timeSinceLastDaily < dailyCooldown) {
      const hoursLeft = Math.ceil((dailyCooldown - timeSinceLastDaily) / (60 * 60 * 1000));
      return ctx.reply(
        `⏰ Daily reward already claimed!\n\nCome back in ${hoursLeft} hours.`
      );
    }

    const dailyRewards = {
      gold: 500,
      xp: 100,
      energy: 25
    };

    await updateHero(userId, {
      gold: hero.gold + dailyRewards.gold,
      xp: hero.xp + dailyRewards.xp,
      lastDailyClaimTime: now
    });

    await ctx.reply(
      '🎁 *DAILY REWARD CLAIMED!*\n\n' +
      `💰 Gold: +${dailyRewards.gold}\n` +
      `⭐ XP: +${dailyRewards.xp}\n` +
      `⚡ Energy: +${dailyRewards.energy}\n\n` +
      'Come back tomorrow for more!'
    );
  } catch (error) {
    console.error('[daily]', error);
    await ctx.reply('❌ Error claiming daily reward');
  }
};
