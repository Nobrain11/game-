// config/constants.js

module.exports = {
  CLASSES: {
    WARRIOR: { name: 'Warrior', hp: 120, attack: 15, defense: 12, magic: 5,  speed: 8  },
    MAGE:    { name: 'Mage',    hp: 80,  attack: 8,  defense: 6,  magic: 18, speed: 12 },
    ARCHER:  { name: 'Archer',  hp: 100, attack: 14, defense: 8,  magic: 8,  speed: 15 },
    ROGUE:   { name: 'Rogue',   hp: 90,  attack: 16, defense: 7,  magic: 6,  speed: 16 },
    PALADIN: { name: 'Paladin', hp: 130, attack: 12, defense: 14, magic: 10, speed: 9  },
  },

  // Mission cost in $MAGIC (deducted on start, split per TOKEN_SPLIT)
  MISSION_COST: 100_000,

  MISSION_DIFFICULTIES: {
    EASY:   { name: 'Easy',   duration: 300,  xp: 50  },
    MEDIUM: { name: 'Medium', duration: 600,  xp: 150 },
    HARD:   { name: 'Hard',   duration: 1200, xp: 300 },
    INSANE: { name: 'Insane', duration: 1800, xp: 500 },
    // NOTE: rewards are no longer static — they come from TOKEN_SPLIT applied to MISSION_COST
  },

  // How mission cost is split (must sum to 1.0)
  TOKEN_SPLIT: {
    BURN:      0.20, // 20% permanently burned
    MARKETING: 0.10, // 10% to marketing wallet
    BUYBACK:   0.10, // 10% to buyback pool
    PLAYER:    0.60, // 60% returned to player as reward
  },

  // Game constants
  MAX_LEVEL: 100,
  XP_PER_LEVEL: 1000,
  COOLDOWN_MISSION: 300,
  COOLDOWN_ARENA: 600,
  COOLDOWN_RAID: 1800,
  COOLDOWN_HEAL: 600,

  RARITIES: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],

  PVP_WIN_REWARD:  500,
  PVP_LOSS_REWARD: 100,
  ELO_FACTOR: 32,
};
