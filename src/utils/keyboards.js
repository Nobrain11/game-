const { Markup } = require('telegraf');

const mainMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('👤 Profile', 'profile'), Markup.button.callback('📊 Stats', 'stats')],
    [Markup.button.callback('⚔️ Mission', 'mission'), Markup.button.callback('🎯 Arena', 'arena')],
    [Markup.button.callback('👥 Guild', 'guild'), Markup.button.callback('🛍️ Market', 'market')],
    [Markup.button.callback('📜 Quests', 'quests'), Markup.button.callback('🏆 Top', 'top')],
  ]);

const classSelection = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('🗡️ Warrior', 'class_warrior'), Markup.button.callback('🧙 Mage', 'class_mage')],
    [Markup.button.callback('🏹 Archer', 'class_archer'), Markup.button.callback('🗡️ Rogue', 'class_rogue')],
    [Markup.button.callback('✨ Paladin', 'class_paladin')],
  ]);

const missionDifficulty = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Easy', 'mission_easy'), Markup.button.callback('🟡 Medium', 'mission_medium')],
    [Markup.button.callback('🔴 Hard', 'mission_hard'), Markup.button.callback('⚫ Insane', 'mission_insane')],
  ]);

const arenaOptions = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('⚔️ Attack', 'arena_attack'), Markup.button.callback('📋 Queue', 'arena_queue')],
    [Markup.button.callback('📊 Stats', 'pvp_stats')],
  ]);

const yesNo = (yesCallback, noCallback) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Yes', yesCallback),
      Markup.button.callback('❌ No', noCallback),
    ],
  ]);

const backButton = (callback = 'back') =>
  Markup.inlineKeyboard([[Markup.button.callback('← Back', callback)]]);

const guildMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('ℹ️ Info', 'guild_info'), Markup.button.callback('👥 Members', 'guild_members')],
    [Markup.button.callback('⚔️ Raid', 'guild_raid'), Markup.button.callback('💰 Treasury', 'guild_treasury')],
  ]);

module.exports = {
  mainMenu,
  classSelection,
  missionDifficulty,
  arenaOptions,
  yesNo,
  backButton,
  guildMenu,
};
