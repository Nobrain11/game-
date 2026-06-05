// tokenomics.js
// Handles all $MAGIC token flows: burn, buyback, marketing, player reward
// TOKEN_SPLIT: 20% burn | 10% marketing | 10% buyback | 60% player

const db = require('../db/index');
const { TOKEN_SPLIT } = require('../config/constants');

/**
 * Apply the full token split when a player spends $MAGIC (e.g. mission cost).
 * Deducts from player, logs burn, credits buyback/marketing wallets in DB.
 *
 * @param {number} userId        - Telegram user ID
 * @param {number} totalAmount   - Total $MAGIC being spent
 * @param {string} reason        - e.g. 'mission_easy'
 * @returns {{ burn, marketing, buyback, player }} - amounts per bucket
 */
function applyTokenSplit(userId, totalAmount, reason) {
  const burn      = Math.floor(totalAmount * TOKEN_SPLIT.BURN);       // 20%
  const marketing = Math.floor(totalAmount * TOKEN_SPLIT.MARKETING);  // 10%
  const buyback   = Math.floor(totalAmount * TOKEN_SPLIT.BUYBACK);    // 10%
  const player    = totalAmount - burn - marketing - buyback;         // 60% (avoids rounding drift)

  const deductUser = db.prepare(
    'UPDATE users SET magic_balance = magic_balance - ? WHERE user_id = ? AND magic_balance >= ?'
  );
  const result = deductUser.run(totalAmount, userId, totalAmount);

  if (result.changes === 0) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  // Log the burn
  db.prepare(
    'INSERT INTO burn_log (user_id, amount, reason) VALUES (?, ?, ?)'
  ).run(userId, burn, reason);

  // Log marketing & buyback allocations
  db.prepare(
    'INSERT INTO token_allocations (bucket, amount, reason, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
  ).run('marketing', marketing, reason);

  db.prepare(
    'INSERT INTO token_allocations (bucket, amount, reason, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
  ).run('buyback', buyback, reason);

  return { burn, marketing, buyback, player };
}

/**
 * Pay a reward to a player (their 60% share after split).
 * Used after mission completion.
 *
 * @param {number} userId   - Telegram user ID
 * @param {number} amount   - Amount to credit
 * @param {string} reason   - e.g. 'mission_reward_easy'
 */
function payPlayerReward(userId, amount, reason) {
  db.prepare(
    'UPDATE users SET magic_balance = magic_balance + ? WHERE user_id = ?'
  ).run(amount, userId);

  db.prepare(
    'INSERT INTO token_allocations (bucket, amount, reason, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
  ).run('player_reward', amount, reason);
}

/**
 * Get total burned all time
 */
function getTotalBurned() {
  const row = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM burn_log').get();
  return row.total;
}

/**
 * Get burn stats for today
 */
function getTodayBurnStats() {
  const row = db.prepare(`
    SELECT
      COALESCE(SUM(amount), 0) as total_burned,
      COUNT(DISTINCT user_id) as player_count
    FROM burn_log
    WHERE date(burned_at) = date('now')
  `).get();
  return row;
}

/**
 * Get weekly burn total
 */
function getWeeklyTotal() {
  const row = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM burn_log
    WHERE burned_at >= datetime('now', '-7 days')
  `).get();
  return row.total;
}

/**
 * Get all-time burn total
 */
function getAllTimeTotal() {
  return getTotalBurned();
}

/**
 * Get top burners for a given period
 * @param {number} limit
 * @param {'today'|'week'|'alltime'} period
 */
function getTopBurners(limit = 5, period = 'today') {
  let whereClause = '';
  if (period === 'today') {
    whereClause = `WHERE date(b.burned_at) = date('now')`;
  } else if (period === 'week') {
    whereClause = `WHERE b.burned_at >= datetime('now', '-7 days')`;
  }

  return db.prepare(`
    SELECT u.username, COALESCE(SUM(b.amount), 0) as amount
    FROM burn_log b
    JOIN users u ON b.user_id = u.user_id
    ${whereClause}
    GROUP BY b.user_id
    ORDER BY amount DESC
    LIMIT ?
  `).all(limit);
}

/**
 * Get total buyback allocated (for dashboard display)
 */
function getTotalBuybackAllocated() {
  const row = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM token_allocations
    WHERE bucket = 'buyback'
  `).get();
  return row.total;
}

module.exports = {
  applyTokenSplit,
  payPlayerReward,
  getTodayBurnStats,
  getWeeklyTotal,
  getAllTimeTotal,
  getTopBurners,
  getTotalBuybackAllocated,
};
