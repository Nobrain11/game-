const { Markup } = require('telegraf');
const { getHero, updateHero } = require('../db/heroes');
const { simulateBattle } = require('../game/battleEngine');
const { formatBattleResult } = require('../utils/formatters');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  try {
    const hero = await getHero(userId);
    if (!hero) {
      return ctx.reply('❌ You need to create a hero first! /create');
    }

    if (hero.health <= 0) {
      return ctx.reply('💤 You need to rest before battling. Your health is too low.');
    }

    const difficulty = ctx.match?.[1] || 'normal';
    const validDifficulties = ['easy', 'normal', 'hard'];
    
    if (!validDifficulties.includes(difficulty)) {
      const buttons = validDifficulties.map(d => [
        Markup.button.callback(
          d.toUpperCase(),
          `battle_${d}`
        )
      ]);
      return ctx.reply(
        '⚔️ *SELECT DIFFICULTY*',
        Markup.inlineKeyboard(buttons)
      );
    }

    const result = simulateBattle(hero, difficulty);
    const battleText = formatBattleResult(result);
    
    await updateHero(userId, {
      health: result.finalHealth,
      xp: hero.xp + result.xpGain,
      gold: hero.gold + result.goldReward
    });

    await ctx.reply(battleText, { parse_mode: 'Markdown' });
    await ctx.answerCbQuery('Battle started!');
  } catch (error) {
    console.error('[battle]', error);
    await ctx.reply('❌ Error starting battle');
  }
};
