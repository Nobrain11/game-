const { getHero } = require('../db/heroes');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  try {
    const hero = await getHero(userId);
    if (!hero) {
      return ctx.reply('❌ You need to create a hero first! /create');
    }

    const inventory = hero.items || [];
    
    if (inventory.length === 0) {
      return ctx.reply('📦 Your inventory is empty!\n\nGo on missions to find items.');
    }

    let inventoryText = '📦 *YOUR INVENTORY*\n\n';
    
    inventory.forEach((item, idx) => {
      inventoryText += `${idx + 1}. ${item.emoji} *${item.name}*\n`;
      inventoryText += `   Rarity: ${item.rarity}\n`;
      inventoryText += `   ${item.stat}: +${item.value}\n\n`;
    });

    inventoryText += `\n📊 Inventory slots: ${inventory.length}/10`;

    await ctx.reply(inventoryText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('[inventory]', error);
    await ctx.reply('❌ Error fetching inventory');
  }
};
