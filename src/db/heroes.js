const db = require('./index');
const { CLASSES } = require('../config/constants');

const getHero = (userId) => {
  return db.prepare('SELECT * FROM heroes WHERE user_id = ?').get(userId);
};

const createHero = (userId, heroClass) => {
  const stats = CLASSES[heroClass];
  if (!stats) throw new Error('Invalid class');

  db.prepare(`
    INSERT INTO heroes (user_id, class, level, xp, hp, max_hp, attack, defense, magic, speed, crit)
    VALUES (?, ?, 1, 0, ?, ?, ?, ?, ?, ?, 5)
  `).run(userId, heroClass, stats.hp, stats.hp, stats.attack, stats.defense, stats.magic, stats.speed);

  return getHero(userId);
};

const addXP = (userId, amount) => {
  const hero = getHero(userId);
  if (!hero) throw new Error('Hero not found');

  db.prepare('UPDATE heroes SET xp = xp + ? WHERE user_id = ?').run(amount, userId);
  return getHero(userId);
};

const updateHeroStats = (userId, updates) => {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(userId);

  db.prepare(`UPDATE heroes SET ${fields} WHERE user_id = ?`).run(...values);
  return getHero(userId);
};

const equipItem = (userId, itemId) => {
  const item = db.prepare('SELECT * FROM inventory WHERE id = ? AND user_id = ?').get(itemId, userId);
  if (!item) throw new Error('Item not found');

  db.prepare('UPDATE inventory SET equipped = 0 WHERE user_id = ? AND stat_type = ?').run(userId, item.stat_type);
  db.prepare('UPDATE inventory SET equipped = 1 WHERE id = ?').run(itemId);
};

const getTopHeroes = (limit = 10) => {
  return db.prepare(`
    SELECT user_id, class, level, xp FROM heroes
    ORDER BY level DESC, xp DESC
    LIMIT ?
  `).all(limit);
};

module.exports = {
  getHero,
  createHero,
  addXP,
  updateHeroStats,
  equipItem,
  getTopHeroes,
};
