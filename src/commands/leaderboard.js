const { getTopHeroes } = require('../db/heroes');

module.exports = async (ctx) => {
  try {
    const topHeroes = await getTopHeroes(10);

    if (!topHeroes || topHeroes.length === 0) {
      return ctx.reply('📊 No heroes yet! Be the first to /create a hero!');
    }

    let leaderboardText = '🏆 *TOP 10 HEROES*\n\n';

    topHeroes.forEach((hero, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      leaderboardText += 
        `${medal} *${hero.name}* (Lvl ${hero.level})\n` +
        `   Class: ${hero.class} | XP: ${hero.xp}\n` +
        `   Battles Won: ${hero.battlesWon || 0}\n\n`;
    });

    await ctx.reply(leaderboardText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('[leaderboard]', error);
    await ctx.reply('❌ Error fetching leaderboard');
  }
};
