const db = require('../db');
const { MISSION_DIFFICULTIES, TOKEN_SPLIT } = require('../config/constants');
const userDb = require('../db/users');

const startMission = (userId, difficulty) => {
  const config = MISSION_DIFFICULTIES[difficulty];
  if (!config) throw new Error('Invalid difficulty');

  const endTime = new Date(Date.now() + config.duration * 1000);

  const stmt = db.prepare(`
    INSERT INTO missions (user_id, difficulty, ends_at)
    VALUES (?, ?, ?)
  `);

  stmt.run(userId, difficulty, endTime.toISOString());

  return {
    difficulty,
    duration: config.duration,
    reward: config.reward,
    xp: config.xp,
    endsAt: endTime.toISOString(),
  };
};

const getMission = (userId) => {
  return db.prepare('SELECT * FROM missions WHERE user_id = ? AND collected = 0').get(userId);
};

const isMissionComplete = (userId) => {
  const mission = getMission(userId);
  if (!mission) return false;
  return new Date(mission.ends_at) <= new Date();
};

const collectMission = (userId) => {
  const mission = getMission(userId);
  if (!mission) throw new Error('No active mission');

  if (!isMissionComplete(userId)) {
    const timeLeft = (new Date(mission.ends_at) - Date.now()) / 1000;
    throw new Error(`Mission not ready. ${Math.floor(timeLeft)}s remaining`);
  }

  const config = MISSION_DIFFICULTIES[mission.difficulty];
  const totalReward = config.reward;

  // Split tokens
  const burnAmount = Math.floor(totalReward * TOKEN_SPLIT.BURN);
  const playerAmount = Math.floor(totalReward * TOKEN_SPLIT.PLAYER);

  // Add to player balance
  userDb.addMagicBalance(userId, playerAmount);

  // Log burn
  db.prepare('INSERT INTO burn_log (user_id, amount, reason) VALUES (?, ?, ?)')
    .run(userId, burnAmount, 'mission_burn');

  // Mark as collected
  db.prepare('UPDATE missions SET collected = 1 WHERE id = ?').run(mission.id);

  // Add XP
  db.prepare('UPDATE heroes SET xp = xp + ? WHERE user_id = ?').run(config.xp, userId);

  return {
    totalReward,
    burnAmount,
    playerAmount,
    xp: config.xp,
  };
};

const getTotalBurnedToday = () => {
  const today = new Date().toISOString().split('T')[0];
  const result = db.prepare(`
    SELECT SUM(amount) as total FROM burn_log
    WHERE DATE(burned_at) = ?
  `).get(today);

  return result.total || 0;
};

const getTopBurners = (limit = 5) => {
  return db.prepare(`
    SELECT user_id, SUM(amount) as total_burned FROM burn_log
    WHERE DATE(burned_at) = DATE('now')
    GROUP BY user_id
    ORDER BY total_burned DESC
    LIMIT ?
  `).all(limit);
};

module.exports = {
  startMission,
  getMission,
  isMissionComplete,
  collectMission,
  getTotalBurnedToday,
  getTopBurners,
};
