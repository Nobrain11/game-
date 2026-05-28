const { Markup } = require('telegraf');
const { createHero } = require('../db/heroes');
const { formatHeroStats } = require('../utils/formatters');
const { CLASSES, GAME_CONSTANTS } = require('../config/constants');

module.exports = async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  
  const classButtons = Object.entries(CLASSES).map(([key, classData]) => [
    Markup.button.callback(`${classData.emoji} ${classData.name}`, `create_${key}`)
  ]);

  await ctx.reply(
    '⚔️ *CREATE YOUR HERO*\n\n' +
    'Choose your class to begin your adventure!\n\n' +
    Object.entries(CLASSES).map(([_, c]) => 
      `${c.emoji} *${c.name}*: ${c.description}`
    ).join('\n'),
    Markup.inlineKeyboard(classButtons)
  );
};

module.exports.createHero = async (ctx, heroClass) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;

  try {
    const hero = await createHero(userId, username, heroClass);
    
    if (!hero) {
      return ctx.reply('❌ You already have a hero!');
    }

    const stats = formatHeroStats(hero);
    await ctx.reply(
      `✅ *Hero Created!*\n\n${stats}`,
      { parse_mode: 'Markdown' }
    );

    await ctx.answerCbQuery('Hero created! Type /profile to view.');
  } catch (error) {
    console.error('[create]', error);
    await ctx.reply('❌ Error creating hero');
  }
};
