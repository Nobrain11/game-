const db = require('../db');
const { PVP_WIN_REWARD, PVP_LOSS_REWARD, TOKEN_SPLIT } = require('../config/constants');
const userDb = require('../db/users');

const calculateDamage = (attacker, defender) => {
  const baseDamage = attacker.attack + Math.random() * 10;
  const defense = Math.max(0, defender.defense / 2);
  const damage = Math.floor(Math.max(1, baseDamage - defense));
  return damage;
};

const calculateCritChance = (attacker) => {
  return (attacker.crit / 100) * 100 > Math.random() * 100;
};

const fight = (attackerId, defenderId) => {
  const attackerHero = db.prepare('SELECT h.* FROM heroes h JOIN users u ON h.user_id = u.user_id WHERE u.user_id = ?')
    .get(attackerId);
  const defenderHero = db.prepare('SELECT h.* FROM heroes h JOIN users u ON h.user_id = u.user_id WHERE u.user_id = ?')
    .get(defenderId);

  if (!attackerHero || !defenderHero) throw new Error('Hero not found');

  let aHp = attackerHero.hp;
  let dHp = defenderHero.hp;
  const turnLog = [];
  const maxTurns = 20;
  let turn = 0;

  while (aHp > 0 && dHp > 0 && turn < maxTurns) {
    // Attacker turn
    if (Math.random() > 0.4) {
      const damage = calculateDamage(attackerHero, defenderHero);
      const isCrit = calculateCritChance(attackerHero);
      const finalDamage = isCrit ? damage * 1.5 : damage;

      dHp -= finalDamage;
      turnLog.push(`Attacker deals ${Math.floor(finalDamage)}${isCrit ? ' (CRIT)' : ''} damage`);
    } else {
      turnLog.push('Attacker misses!');
    }

    if (dHp <= 0) break;

    // Defender turn
    if (Math.random() > 0.4) {
      const damage = calculateDamage(defenderHero, attackerHero);
      const isCrit = calculateCritChance(defenderHero);
      const finalDamage = isCrit ? damage * 1.5 : damage;

      aHp -= finalDamage;
      turnLog.push(`Defender deals ${Math.floor(finalDamage)}${isCrit ? ' (CRIT)' : ''} damage`);
    } else {
      turnLog.push('Defender misses!');
    }

    turn++;
  }

  const winnerId = aHp > dHp ? attackerId : defenderId;
  const reward = winnerId === attackerId ? PVP_WIN_REWARD : PVP_LOSS_REWARD;

  // Save battle
  db.prepare(`
    INSERT INTO pvp_log (attacker_id, defender_id, winner_id, magic_won)
    VALUES (?, ?, ?, ?)
  `).run(attackerId, defenderId, winnerId, reward);

  // Distribute rewards
  const burnAmount = Math.floor(reward * TOKEN_SPLIT.BURN);
  const playerAmount = Math.floor(reward * TOKEN_SPLIT.PLAYER);

  userDb.addMagicBalance(winnerId, playerAmount);

  db.prepare('INSERT INTO burn_log (user_id, amount, reason) VALUES (?, ?, ?)')
    .run(winnerId, burnAmount, 'pvp_burn');

  return {
    winnerId,
    reward,
    turnLog: turnLog.slice(0, 10),
    complete: turn < maxTurns,
  };
};

const getPvPStats = (userId) => {
  const stats = db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM pvp_log WHERE winner_id = ?) as wins,
      (SELECT COUNT(*) FROM pvp_log WHERE (attacker_id = ? OR defender_id = ?) AND winner_id != ?) as losses
  `).get(userId, userId, userId, userId);

  return {
    wins: stats.wins || 0,
    losses: stats.losses || 0,
    winRate: stats.wins ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0,
  };
};

module.exports = {
  fight,
  getPvPStats,
  calculateDamage,
  calculateCritChance,
};
