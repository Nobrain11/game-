module.exports = async (ctx) => {
  const helpText = `
🎮 *ASTRALIS RPG - COMMAND GUIDE*

📋 *MAIN COMMANDS*
/start - Start the game
/create - Create your hero
/profile - View your profile
/help - Show this help message

⚔️ *GAMEPLAY*
/battle - Start a battle
/mission - Go on a mission
/collect - Collect hourly rewards
/daily - Claim daily reward

📦 *INVENTORY & ITEMS*
/inventory - View your items
/market - Buy items
/upgrade - Upgrade your hero

👥 *SOCIAL*
/guild - Guild system
/leaderboard - Top 10 heroes

💡 *TIPS*
• Complete missions for XP and items
• Battle enemies to earn gold
• Collect hourly rewards and daily bonuses
• Upgrade your stats to get stronger
• Join or create a guild with friends

Happy adventuring! ⚔️`;

  await ctx.reply(helpText, { parse_mode: 'Markdown' });
};
