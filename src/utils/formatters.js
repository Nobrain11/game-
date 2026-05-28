const hpBar = (current, max, length = 10) => {
  const filled = Math.floor((current / max) * length);
  return '█'.repeat(filled) + '░'.repeat(length - filled);
};

const xpBar = (current, max, length = 10) => {
  const filled = Math.floor((current / max) * length);
  return '▰'.repeat(filled) + '▱'.repeat(length - filled);
};

const formatTime = (seconds) => {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const heroStats = (hero) => {
  return `
<b>Hero Stats</b>
Level: ${hero.level}
HP: ${hero.hp}/${hero.max_hp} ${hpBar(hero.hp, hero.max_hp)}
ATK: ${hero.attack} | DEF: ${hero.defense} | MAG: ${hero.magic} | SPD: ${hero.speed} | CRIT: ${hero.crit}%
XP: ${hero.xp}
  `.trim();
};

const missionStatus = (mission, config) => {
  if (!mission) return 'No active mission';

  const now = new Date();
  const ends = new Date(mission.ends_at);
  const remaining = Math.max(0, (ends - now) / 1000);
  const isComplete = remaining <= 0;

  return `
<b>Active Mission</b>
Difficulty: ${mission.difficulty}
Status: ${isComplete ? '✅ Ready to collect!' : `⏳ ${formatTime(remaining)} remaining`}
Reward: ${formatNumber(config.reward)} tokens
XP: ${config.xp}
  `.trim();
};

module.exports = {
  hpBar,
  xpBar,
  formatTime,
  formatNumber,
  heroStats,
  missionStatus,
};
