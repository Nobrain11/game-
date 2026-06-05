// commands/mission.js
// Fixed: checks balance, deducts mission cost, applies TOKEN_SPLIT, pays reward on collect

const heroDb = require('../db/heroes');
const userDb = require('../db/users');
const missionEngine = require('../game/missionEngine');
const tokenomics = require('../game/tokenomics');
const { MISSION_DIFFICULTIES, MISSION_COST } = require('../config/constants');
const { formatTime, formatNumber, missionStatus } = require('../utils/formatters');
const { missionDifficulty } = require('../utils/keyboards');

const MISSION_COST_MAGIC = 100_000; // 100,000 $MAGIC per mission

module.exports = {
  command: 'mission',
  handler: async (ctx) => {
    const userId = ctx.from.id;

    try {
      const hero = heroDb.getHero(userId);
      if (!hero) {
        return ctx.reply('You need to create a hero first! Use /start');
      }

      const activeMission = missionEngine.getMission(userId);

      if (activeMission && !missionEngine.isMissionComplete(userId)) {
        return ctx.reply(missionStatus(activeMission, MISSION_DIFFICULTIES[activeMission.difficulty]));
      }

      if (activeMission && missionEngine.isMissionComplete(userId)) {
        return ctx.reply(
          '📌 You have a completed mission! Use /collect to claim your rewards.',
          { reply_markup: { inline_keyboard: [[{ text: '💰 Collect', callback_data: 'collect' }]] } }
        );
      }

      // Show balance and cost before letting them pick
      const balance = userDb.getMagicBalance(userId);
      if (balance < MISSION_COST_MAGIC) {
        return ctx.reply(
          `❌ Not enough $MAGIC!\n\n` +
          `Mission cost: ${formatNumber(MISSION_COST_MAGIC)} $MAGIC\n` +
          `Your balance: ${formatNumber(balance)} $MAGIC\n\n` +
          `Earn more by completing duels or claiming daily rewards.`
        );
      }

      await ctx.reply(
        `⚔️ Choose a mission difficulty:\n\n💸 Cost: ${formatNumber(MISSION_COST_MAGIC)} $MAGIC`,
        missionDifficulty()
      );
    } catch (error) {
      console.error('[mission] command error:', error);
      await ctx.reply('Error starting mission. Please try again.');
    }
  },
};

module.exports.startMission = async (ctx, difficulty) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;

  try {
    const config = MISSION_DIFFICULTIES[difficulty];
    if (!config) {
      return ctx.reply('❌ Invalid difficulty.');
    }

    // Deduct cost and apply token split BEFORE starting the mission
    let split;
    try {
      split = tokenomics.applyTokenSplit(userId, MISSION_COST_MAGIC, `mission_${difficulty.toLowerCase()}`);
    } catch (err) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        return ctx.reply(
          `❌ Not enough $MAGIC!\n\nMission cost: ${formatNumber(MISSION_COST_MAGIC)} $MAGIC`
        );
      }
      throw err;
    }

    // Store the player's reward share on the mission record so collect knows what to pay
    const mission = missionEngine.startMission(userId, difficulty, split.player);

    await ctx.reply(
      `⚔️ <b>Mission Started!</b>\n\n` +
      `Difficulty: <b>${config.name}</b>\n` +
      `Duration: ${formatTime(mission.duration)}\n\n` +
      `<b>Token breakdown:</b>\n` +
      `🔥 Burned: ${formatNumber(split.burn)} $MAGIC\n` +
      `🔄 Buyback: ${formatNumber(split.buyback)} $MAGIC\n` +
      `📢 Marketing: ${formatNumber(split.marketing)} $MAGIC\n` +
      `💰 Your reward: ${formatNumber(split.player)} $MAGIC + XP\n\n` +
      `⏳ Use /collect when the mission is complete!`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('[mission] startMission error:', error);
    await ctx.reply('Error starting mission. Please try again.');
  }
};

module.exports.collectMission = async (ctx) => {
  const userId = ctx.from.id;

  try {
    if (!missionEngine.isMissionComplete(userId)) {
      const mission = missionEngine.getMission(userId);
      if (!mission) {
        return ctx.reply('❌ No active mission. Use /mission to start one.');
      }
      return ctx.reply(missionStatus(mission, MISSION_DIFFICULTIES[mission.difficulty]));
    }

    const result = missionEngine.collectMission(userId);
    if (!result) {
      return ctx.reply('❌ No completed mission to collect.');
    }

    // Pay the player their pre-calculated reward share
    tokenomics.payPlayerReward(userId, result.playerReward, `mission_reward_${result.difficulty.toLowerCase()}`);

    // Add XP
    heroDb.addXP(userId, result.xp);

    await ctx.reply(
      `✅ <b>Mission Complete!</b>\n\n` +
      `Difficulty: <b>${result.difficulty}</b>\n` +
      `💰 Earned: ${formatNumber(result.playerReward)} $MAGIC\n` +
      `⭐ XP: +${result.xp}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('[mission] collectMission error:', error);
    await ctx.reply('Error collecting mission. Please try again.');
  }
};
