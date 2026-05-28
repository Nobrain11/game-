const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  const buttons = [
    [Markup.button.callback('🔨 Create Guild', 'guild_create')],
    [Markup.button.callback('📋 My Guild', 'guild_my')],
    [Markup.button.callback('🔍 Browse Guilds', 'guild_browse')]
  ];

  await ctx.reply(
    '⚔️ *GUILD SYSTEM*\n\n' +
    'Join forces with other players!\n\n' +
    '• Create or join a guild\n' +
    '• Participate in guild raids\n' +
    '• Share treasury and benefits\n' +
    '• Climb the rankings together',
    Markup.inlineKeyboard(buttons)
  );
};

module.exports.createGuild = async (ctx) => {
  await ctx.reply(
    '📝 Send the guild name (3-20 characters):',
    Markup.removeKeyboard()
  );
  ctx.session.action = 'create_guild';
};

module.exports.myGuild = async (ctx) => {
  await ctx.reply('📋 You are not in a guild yet.\nUse /guild to create or join one!');
};
