const missionEngine = require('../game/missionEngine');
const heroDb = require('../db/heroes');
const { MISSION_DIFFICULTIES } = require('../config/constants');
const { formatTime, formatNumber, missionStatus } = require('../utils/formatters');
const { missionDifficulty } = require('../utils/keyboards');
const cooldownMiddleware = require('../middleware/cooldown');

module.exports = {
  command: 'mission',
  handler: async (ctx) => {
    const userId = ctx.from.id;

    try {
      const hero = heroDb.getHero(userId);
      if (!hero) {
        await ctx.reply('You need to create a hero first! Use /start');
        return;
      }

      const activeMission = missionEngine.getMission(userId);
      if (activeMission && !missionEngine.isMissionComplete(userId)) {
        await ctx.reply(missionStatus(activeMission, MISSION_DIFFICULTIES[activeMission.difficulty]));
        return;
      }

      if (activeMission && missionEngine.isMissionComplete(userId)) {
        await ctx.reply(
          '📌 You have a completed mission! Use /collect to claim your rewards.',
          { reply_markup: { inline_keyboard: [[{ text: '💰 Collect', callback_data: 'collect' }]] } }
        );
        return;
      }

      // Start new mission
      await ctx.reply('Choose a mission difficulty:', missionDifficulty());
    } catch (error) {
      console.error('[v0] Mission command error:', error);
      await ctx.reply('Error starting mission. Please try again.');
    }
  },
};

module.exports.startMission = async (ctx, difficulty) => {
  const userId = ctx.from.id;

  try {
    const mission = missionEngine.startMission(userId, difficulty);
    const config = MISSION_DIFFICULTIES[difficulty];

    await ctx.reply(
      `
⚔️ <b>Mission Started!</b>

Difficulty: <b>${difficulty}</b>
Duration: ${formatTime(mission.duration)}
Reward: <b>${formatNumber(config.reward)}</b> tokens
XP: <b>${config.xp}</b>

⏳ Your mission will be ready in ${formatTime(mission.duration)}.
Use /collect when complete!
      `.trim(),
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('[v0] Start mission error:', error);
    await ctx.reply('Error starting mission. Please try again.');
  }
};
