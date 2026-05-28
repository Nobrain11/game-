const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  const marketItems = [
    { id: 1, name: 'Iron Sword', price: 100, emoji: '⚔️', rarity: 'common' },
    { id: 2, name: 'Steel Shield', price: 150, emoji: '🛡️', rarity: 'common' },
    { id: 3, name: 'Elven Bow', price: 250, emoji: '🏹', rarity: 'rare' },
    { id: 4, name: 'Dragon Helmet', price: 500, emoji: '🐉', rarity: 'epic' },
    { id: 5, name: 'Mana Crystal', price: 200, emoji: '💎', rarity: 'rare' }
  ];

  let marketText = '🏪 *MARKETPLACE*\n\n';
  const buttons = [];

  marketItems.forEach(item => {
    marketText += `${item.emoji} *${item.name}*\n`;
    marketText += `   Price: ${item.price} 🪙\n`;
    marketText += `   Rarity: ${item.rarity}\n\n`;
    
    buttons.push([
      Markup.button.callback(`Buy ${item.name.split(' ')[0]}`, `buy_${item.id}`)
    ]);
  });

  await ctx.reply(marketText, Markup.inlineKeyboard(buttons));
};
