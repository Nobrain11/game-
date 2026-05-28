const db = require('./index');

const getUser = (userId) => {
  return db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
};

const createUser = (userId, username) => {
  const stmt = db.prepare(`
    INSERT INTO users (user_id, username, magic_balance)
    VALUES (?, ?, 0)
  `);
  stmt.run(userId, username);
  return getUser(userId);
};

const setWalletAddress = (userId, address) => {
  db.prepare('UPDATE users SET wallet_address = ? WHERE user_id = ?').run(address, userId);
};

const addMagicBalance = (userId, amount) => {
  db.prepare('UPDATE users SET magic_balance = magic_balance + ? WHERE user_id = ?').run(amount, userId);
};

const getMagicBalance = (userId) => {
  const user = getUser(userId);
  return user ? user.magic_balance : 0;
};

const setMagicBalance = (userId, amount) => {
  db.prepare('UPDATE users SET magic_balance = ? WHERE user_id = ?').run(amount, userId);
};

const getTopPlayers = (limit = 10) => {
  return db.prepare(`
    SELECT u.user_id, u.username, h.level, h.xp
    FROM users u
    JOIN heroes h ON u.user_id = h.user_id
    ORDER BY h.level DESC, h.xp DESC
    LIMIT ?
  `).all(limit);
};

module.exports = {
  getUser,
  createUser,
  setWalletAddress,
  addMagicBalance,
  getMagicBalance,
  setMagicBalance,
  getTopPlayers,
};
