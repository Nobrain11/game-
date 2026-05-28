const heroDb = require('../db/heroes');
const userDb = require('../db/users');
const { formatNumber, hpBar } = require('../utils/formatters');

module.exports = {
  command: 'profile',
  handler: async (ctx) => {
    const userId = ctx.from.id;

    try {
      const hero = heroDb.getHero(userId);
      const user = userDb.getUser(userId);

      if (!hero) {
        await ctx.reply('You need to create a hero first! Use /start');
        return;
      }

      const message = `
<b>⚔️ ${ctx.from.first_name}'s Profile</b>

<b>Hero: ${hero.class}</b>
Level: <b>${hero.level}</b>
HP: ${hero.hp}/${hero.max_hp} ${hpBar(hero.hp, hero.max_hp)}

<b>Stats</b>
ATK: ${hero.attack} | DEF: ${hero.defense}
MAG: ${hero.magic} | SPD: ${hero.speed} | CRIT: ${hero.crit}%

<b>Balance</b>
🪙 Tokens: <code>${formatNumber(user.magic_balance)}</code>
${user.wallet_address ? `💰 Wallet: <code>${user.wallet_address.slice(0, 8)}...</code>` : ''}
      `.trim();

      await ctx.reply(message, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('[v0] Profile command error:', error);
      await ctx.reply('Error loading profile. Please try again.');
    }
  },
};
