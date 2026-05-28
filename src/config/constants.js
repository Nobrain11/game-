module.exports = {
  // Class Stats
  CLASSES: {
    WARRIOR: {
      name: 'Warrior',
      hp: 120,
      attack: 15,
      defense: 12,
      magic: 5,
      speed: 8,
    },
    MAGE: {
      name: 'Mage',
      hp: 80,
      attack: 8,
      defense: 6,
      magic: 18,
      speed: 12,
    },
    ARCHER: {
      name: 'Archer',
      hp: 100,
      attack: 14,
      defense: 8,
      magic: 8,
      speed: 15,
    },
    ROGUE: {
      name: 'Rogue',
      hp: 90,
      attack: 16,
      defense: 7,
      magic: 6,
      speed: 16,
    },
    PALADIN: {
      name: 'Paladin',
      hp: 130,
      attack: 12,
      defense: 14,
      magic: 10,
      speed: 9,
    },
  },

  // Mission Difficulties
  MISSION_DIFFICULTIES: {
    EASY: { name: 'Easy', duration: 300, reward: 1000, xp: 50 },
    MEDIUM: { name: 'Medium', duration: 600, reward: 2500, xp: 150 },
    HARD: { name: 'Hard', duration: 1200, reward: 5000, xp: 300 },
    INSANE: { name: 'Insane', duration: 1800, reward: 10000, xp: 500 },
  },

  // Token Distribution
  TOKEN_SPLIT: {
    BURN: 0.2,      // 20% burned
    MARKETING: 0.1, // 10% to marketing
    BUYBACK: 0.1,   // 10% to buyback
    PLAYER: 0.6,    // 60% to player
  },

  // Game Constants
  MAX_LEVEL: 100,
  XP_PER_LEVEL: 1000,
  COOLDOWN_MISSION: 300,
  COOLDOWN_ARENA: 600,
  COOLDOWN_RAID: 1800,
  COOLDOWN_HEAL: 600,

  // Item Rarities
  RARITIES: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],

  // PvP
  PVP_WIN_REWARD: 500,
  PVP_LOSS_REWARD: 100,
  ELO_FACTOR: 32,
};
