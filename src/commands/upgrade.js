const { Markup } = require('telegraf');
const { getHero, updateHero } = require('../db/heroes');
const { GAME_CONSTANTS } = require('../config/constants');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  try {
    const hero = await getHero(userId);
    if (!hero) {
      return ctx.reply('❌ You need to create a hero first! /create');
    }

    const upgradeCost = hero.level * 50;
    const nextLevelStats = {
      maxHealth: hero.maxHealth + 10,
      attack: hero.attack + 5,
      defense: hero.defense + 3,
      magic: hero.magic + 4
    };

    const buttons = [
      [Markup.button.callback('✅ Upgrade', 'confirm_upgrade')],
      [Markup.button.callback('❌ Cancel', 'cancel_upgrade')]
    ];

    await ctx.reply(
      `⬆️ *UPGRADE OPTIONS*\n\n` +
      `Current Level: ${hero.level}\n` +
      `Cost: ${upgradeCost} 🪙\n` +
      `Your Gold: ${hero.gold}\n\n` +
      `*Next Level Stats:*\n` +
      `❤️ Health: ${hero.maxHealth} → ${nextLevelStats.maxHealth}\n` +
      `⚔️ Attack: ${hero.attack} → ${nextLevelStats.attack}\n` +
      `🛡️ Defense: ${hero.defense} → ${nextLevelStats.defense}\n` +
      `✨ Magic: ${hero.magic} → ${nextLevelStats.magic}`,
      Markup.inlineKeyboard(buttons)
    );

    ctx.session.pendingUpgrade = { cost: upgradeCost, newStats: nextLevelStats };
  } catch (error) {
    console.error('[upgrade]', error);
    await ctx.reply('❌ Error loading upgrades');
  }
};

module.exports.confirmUpgrade = async (ctx) => {
  const userId = ctx.from.id;
  const upgrade = ctx.session.pendingUpgrade;

  if (!upgrade) {
    return ctx.reply('❌ No pending upgrade');
  }

  try {
    const hero = await getHero(userId);
    
    if (hero.gold < upgrade.cost) {
      return ctx.reply(`❌ Not enough gold! You need ${upgrade.cost} 🪙`);
    }

    await updateHero(userId, {
      level: hero.level + 1,
      gold: hero.gold - upgrade.cost,
      maxHealth: upgrade.newStats.maxHealth,
      attack: upgrade.newStats.attack,
      defense: upgrade.newStats.defense,
      magic: upgrade.newStats.magic
    });

    await ctx.reply(
      `✅ *UPGRADED TO LEVEL ${hero.level + 1}!*\n\n` +
      `Stats increased!\n` +
      `💰 Gold spent: ${upgrade.cost}`
    );
  } catch (error) {
    console.error('[confirmUpgrade]', error);
    await ctx.reply('❌ Error upgrading');
  }
};
