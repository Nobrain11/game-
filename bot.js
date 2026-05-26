/**
 * ASTRALIS RPG BOT — Phase 1
 * Telegraf.js · Node.js · SQLite · Canvas
 * 
 * Commands:
 *   /start         — welcome
 *   /create        — create your character
 *   /profile       — view character card
 *   /mission       — go on a mission
 *   /collect       — collect mission rewards
 *   /inventory     — view items
 *   /equip [item]  — equip an item
 *   /stats         — view power stats
 *   /top           — leaderboard
 *   /help          — command list
 */

require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const Database = require('better-sqlite3');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const BOT_TOKEN = process.env.BOT_TOKEN;
const MAGIC_BURN_AMOUNT = 100_000; // MAGIC tokens to send on mission
const MISSION_DURATIONS = {
  quick:  15 * 60,       // 15 min
  normal: 60 * 60,       // 1 hour
  hard:   4  * 60 * 60,  // 4 hours
  epic:   12 * 60 * 60,  // 12 hours
};

// ─── DATABASE ────────────────────────────────────────────────────────────────

const db = new Database('./astralis.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS characters (
    user_id     INTEGER PRIMARY KEY,
    username    TEXT,
    class       TEXT,
    level       INTEGER DEFAULT 1,
    xp          INTEGER DEFAULT 0,
    hp          INTEGER,
    max_hp      INTEGER,
    attack      INTEGER,
    defense     INTEGER,
    magic_power INTEGER,
    speed       INTEGER,
    magic_tokens INTEGER DEFAULT 0,
    created_at  INTEGER DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS missions (
    user_id     INTEGER PRIMARY KEY,
    mission_id  TEXT,
    mission_name TEXT,
    difficulty  TEXT,
    started_at  INTEGER,
    ends_at     INTEGER,
    collected   INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER,
    item_name   TEXT,
    item_type   TEXT,
    rarity      TEXT,
    stat_bonus  TEXT,
    equipped    INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS burns (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER,
    amount      INTEGER,
    reason      TEXT,
    burned_at   INTEGER DEFAULT (strftime('%s','now'))
  );
`);

// ─── CLASSES ─────────────────────────────────────────────────────────────────

const CLASSES = {
  Warrior: {
    emoji: '⚔️',
    color: '#c0392b',
    base: { hp: 120, max_hp: 120, attack: 18, defense: 14, magic_power: 4, speed: 8 },
    description: 'Frontline fighter. High HP and attack.',
    gear: ['Sword', 'Shield', 'Plate Armor', 'War Helmet', 'Iron Boots'],
  },
  Mage: {
    emoji: '🔮',
    color: '#8e44ad',
    base: { hp: 70, max_hp: 70, attack: 8, defense: 6, magic_power: 24, speed: 12 },
    description: 'Master of arcane arts. Devastating magic damage.',
    gear: ['Staff', 'Robes', 'Arcane Tome', 'Mage Hood', 'Silk Boots'],
  },
  Archer: {
    emoji: '🏹',
    color: '#27ae60',
    base: { hp: 85, max_hp: 85, attack: 16, defense: 8, magic_power: 6, speed: 18 },
    description: 'Agile ranged striker. High speed and crit.',
    gear: ['Bow', 'Quiver', 'Leather Armor', 'Scout Helm', 'Swift Boots'],
  },
  Tank: {
    emoji: '🛡️',
    color: '#2980b9',
    base: { hp: 150, max_hp: 150, attack: 10, defense: 22, magic_power: 2, speed: 5 },
    description: 'Immovable fortress. Extreme defense and HP.',
    gear: ['War Axe', 'Tower Shield', 'Fortress Armor', 'Titan Helm', 'Heavy Boots'],
  },
  Healer: {
    emoji: '✨',
    color: '#f39c12',
    base: { hp: 80, max_hp: 80, attack: 6, defense: 8, magic_power: 20, speed: 10 },
    description: 'Divine support. Powerful heals and buffs.',
    gear: ['Holy Staff', 'Sacred Robes', 'Blessing Tome', 'Halo Crown', 'Light Boots'],
  },
};

// ─── ITEMS ───────────────────────────────────────────────────────────────────

const RARITIES = {
  Common:    { color: '#aaaaaa', chance: 60, emoji: '⚪' },
  Uncommon:  { color: '#2ecc71', chance: 25, emoji: '🟢' },
  Rare:      { color: '#3498db', chance: 10, emoji: '🔵' },
  Epic:      { color: '#9b59b6', chance: 4,  emoji: '🟣' },
  Legendary: { color: '#f39c12', chance: 1,  emoji: '🟡' },
};

const ITEM_POOLS = {
  Warrior:  ['Iron Sword', 'Steel Sword', 'Runic Blade', 'Dragon Slayer', 'Aegis Shield', 'Plate Armor', 'War Helm', 'Titan Boots'],
  Mage:     ['Oak Staff', 'Crystal Staff', 'Void Staff', 'Staff of Eternity', 'Arcane Robes', 'Mage Hood', 'Spell Tome', 'Starweave Boots'],
  Archer:   ['Short Bow', 'Long Bow', 'Shadow Bow', 'Celestial Bow', 'Leather Vest', 'Scout Helm', 'Quiver of Winds', 'Swift Boots'],
  Tank:     ['Iron Buckler', 'Fortress Shield', 'Aegis of Gods', 'Titan Plate', 'War Pauldrons', 'Titan Helm', 'Heavy Gauntlets', 'Earth Boots'],
  Healer:   ['Oak Wand', 'Holy Staff', 'Staff of Light', 'Seraph Staff', 'Sacred Vestments', 'Halo Crown', 'Blessing Tome', 'Light Sandals'],
};

const ITEM_TYPES = {
  'Sword': 'weapon', 'Staff': 'weapon', 'Bow': 'weapon', 'Shield': 'offhand',
  'Armor': 'chest', 'Robes': 'chest', 'Vest': 'chest', 'Plate': 'chest',
  'Helm': 'head', 'Hood': 'head', 'Crown': 'head',
  'Boots': 'feet', 'Sandals': 'feet',
  'Tome': 'offhand', 'Quiver': 'offhand', 'Wand': 'weapon',
};

function getItemType(name) {
  for (const [key, type] of Object.entries(ITEM_TYPES)) {
    if (name.includes(key)) return type;
  }
  return 'misc';
}

function rollRarity(difficulty) {
  const boosts = { quick: 0, normal: 2, hard: 6, epic: 12 };
  const boost = boosts[difficulty] || 0;
  const roll = Math.random() * 100;
  let cumulative = 0;
  const rarities = Object.entries(RARITIES);
  for (let i = rarities.length - 1; i >= 0; i--) {
    const [name, data] = rarities[i];
    const adjustedChance = data.chance + (i >= 3 ? boost * (i - 2) : 0);
    cumulative += adjustedChance;
    if (roll <= cumulative) return name;
  }
  return 'Common';
}

function rollItem(charClass, difficulty) {
  const pool = ITEM_POOLS[charClass] || ITEM_POOLS.Warrior;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const rarity = rollRarity(difficulty);
  const statBonus = generateStatBonus(rarity, charClass);
  return { name: item, type: getItemType(item), rarity, statBonus };
}

function generateStatBonus(rarity, charClass) {
  const multipliers = { Common: 1, Uncommon: 2, Rare: 4, Epic: 7, Legendary: 12 };
  const mult = multipliers[rarity];
  const classStats = {
    Warrior: { attack: mult * 2, defense: mult, hp: mult * 5 },
    Mage:    { magic_power: mult * 3, hp: mult * 2 },
    Archer:  { attack: mult * 2, speed: mult * 2 },
    Tank:    { defense: mult * 3, hp: mult * 8 },
    Healer:  { magic_power: mult * 2, hp: mult * 3 },
  };
  return JSON.stringify(classStats[charClass] || { attack: mult });
}

// ─── MISSIONS ────────────────────────────────────────────────────────────────

const MISSIONS = [
  // quick
  { id: 'goblins',    name: '🗡️ Goblin Caves',        difficulty: 'quick',  xp: 30,  tokens: 500,   desc: 'Clear goblin nests in the Dark Forest.' },
  { id: 'wolves',     name: '🐺 Feral Wolf Pack',      difficulty: 'quick',  xp: 25,  tokens: 400,   desc: 'Wolves terrorize the village. Drive them out.' },
  // normal
  { id: 'dungeon',    name: '🏰 Ruined Dungeon',       difficulty: 'normal', xp: 80,  tokens: 1500,  desc: 'Ancient dungeon full of undead horrors.' },
  { id: 'bandits',    name: '⚔️ Bandit Stronghold',   difficulty: 'normal', xp: 90,  tokens: 1800,  desc: 'Take down the bandit lord and his crew.' },
  { id: 'sea',        name: '🌊 Cursed Shipwreck',     difficulty: 'normal', xp: 85,  tokens: 1600,  desc: 'Explore a ghost ship for lost treasure.' },
  // hard
  { id: 'dragon',     name: '🐉 Dragon\'s Lair',      difficulty: 'hard',   xp: 250, tokens: 5000,  desc: 'Face a young dragon and claim its hoard.' },
  { id: 'necromancer',name: '💀 Necromancer Tower',   difficulty: 'hard',   xp: 280, tokens: 5500,  desc: 'Destroy the undead master before he raises an army.' },
  // epic
  { id: 'titan',      name: '⚡ Titan\'s Domain',     difficulty: 'epic',   xp: 800, tokens: 18000, desc: 'Enter the realm of the Astral Titan.' },
  { id: 'voidgate',   name: '🌌 The Void Gate',       difficulty: 'epic',   xp: 900, tokens: 20000, desc: 'Seal the Void Gate before darkness consumes Astralis.' },
];

function getMissionsByDifficulty(diff) {
  return MISSIONS.filter(m => m.difficulty === diff);
}

function randomMission(difficulty) {
  const pool = getMissionsByDifficulty(difficulty);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── XP / LEVELING ───────────────────────────────────────────────────────────

function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

function checkLevelUp(userId) {
  const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (!char) return null;
  let leveled = false;
  let level = char.level;
  let xp = char.xp;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
    leveled = true;
  }
  if (leveled) {
    const classData = CLASSES[char.class];
    const hpGain = char.class === 'Tank' ? 20 : char.class === 'Warrior' ? 12 : 8;
    db.prepare(`
      UPDATE characters SET level=?, xp=?, max_hp=max_hp+?, hp=max_hp+?,
      attack=attack+?, defense=defense+?, magic_power=magic_power+?, speed=speed+?
      WHERE user_id=?
    `).run(level, xp, hpGain, hpGain,
      Math.floor((classData.base.attack * 0.1)),
      Math.floor((classData.base.defense * 0.1)),
      Math.floor((classData.base.magic_power * 0.1)),
      Math.floor((classData.base.speed * 0.1)),
      userId);
    return level;
  }
  db.prepare('UPDATE characters SET xp=? WHERE user_id=?').run(xp, userId);
  return null;
}

// ─── CHARACTER CARD (Canvas) ─────────────────────────────────────────────────

const CLASS_EMOJIS_ASCII = {
  Warrior: '⚔',
  Mage: '✦',
  Archer: '➶',
  Tank: '◈',
  Healer: '✚',
};

async function generateCharacterCard(char) {
  const W = 600, H = 360;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const classData = CLASSES[char.class];

  // Background
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, W, H);

  // Gradient overlay
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, classData.color + '33');
  grad.addColorStop(1, '#0d0d1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = classData.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, W - 16, H - 16);

  // Inner corner accents
  const corners = [[8,8],[W-8,8],[8,H-8],[W-8,H-8]];
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = classData.color;
    ctx.fill();
  });

  // Class symbol (large background)
  ctx.font = 'bold 140px serif';
  ctx.fillStyle = classData.color + '18';
  ctx.textAlign = 'right';
  ctx.fillText(CLASS_EMOJIS_ASCII[char.class] || '◆', W - 20, H - 10);

  // Username
  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(`@${char.username || 'Unknown'}`, 30, 55);

  // Class badge
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = classData.color;
  ctx.fillText(`${classData.emoji} ${char.class.toUpperCase()}`, 30, 80);

  // Level bar label
  ctx.font = '13px monospace';
  ctx.fillStyle = '#aaaaaa';
  ctx.fillText(`LVL ${char.level}`, 30, 108);

  // XP bar background
  ctx.fillStyle = '#222240';
  ctx.fillRect(80, 95, 200, 12);
  // XP bar fill
  const xpPct = Math.min(char.xp / xpForLevel(char.level), 1);
  ctx.fillStyle = classData.color;
  ctx.fillRect(80, 95, 200 * xpPct, 12);
  ctx.font = '10px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${char.xp} / ${xpForLevel(char.level)} XP`, 82, 106);

  // Divider
  ctx.strokeStyle = classData.color + '55';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 120);
  ctx.lineTo(W - 30, 120);
  ctx.stroke();

  // Stats
  const stats = [
    ['❤️  HP',         `${char.hp} / ${char.max_hp}`],
    ['⚔️  ATK',        `${char.attack}`],
    ['🛡️  DEF',        `${char.defense}`],
    ['🔮  MAGIC',      `${char.magic_power}`],
    ['💨  SPEED',      `${char.speed}`],
    ['🪙  MAGIC TKN',  `${(char.magic_tokens || 0).toLocaleString()}`],
  ];

  ctx.font = '14px monospace';
  stats.forEach(([label, value], i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    const x = 30 + col * 290;
    const y = 150 + row * 32;
    ctx.fillStyle = '#888899';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(value, x + 240, y);
  });

  // Equipped items section
  const equipped = db.prepare(`
    SELECT * FROM inventory WHERE user_id = ? AND equipped = 1 LIMIT 3
  `).all(char.user_id);

  if (equipped.length > 0) {
    ctx.strokeStyle = classData.color + '33';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, H - 80);
    ctx.lineTo(W - 30, H - 80);
    ctx.stroke();

    ctx.font = '11px monospace';
    ctx.fillStyle = '#888899';
    ctx.textAlign = 'left';
    ctx.fillText('EQUIPPED:', 30, H - 60);

    equipped.forEach((item, i) => {
      const rarity = RARITIES[item.rarity];
      ctx.fillStyle = rarity ? rarity.color : '#aaa';
      ctx.fillText(`${rarity?.emoji || '⚪'} ${item.item_name}`, 30 + i * 190, H - 40);
    });
  }

  // Watermark
  ctx.font = '11px monospace';
  ctx.fillStyle = classData.color + '66';
  ctx.textAlign = 'right';
  ctx.fillText('$MAGIC · ASTRALIS', W - 20, H - 15);

  return canvas.toBuffer('image/png');
}

// ─── BOT SETUP ───────────────────────────────────────────────────────────────

const bot = new Telegraf(BOT_TOKEN);

// ─── /start ──────────────────────────────────────────────────────────────────

bot.start((ctx) => {
  ctx.replyWithMarkdown(`
✨ *Welcome to ASTRALIS* ✨

The realm of eternal magic and glory awaits.
Forge your legend. Burn your $MAGIC. Conquer the void.

━━━━━━━━━━━━━━━━━━━━━
Use */create* to forge your character.
Already a hero? Use */profile* to see yourself.
━━━━━━━━━━━━━━━━━━━━━

⚡ *Every mission costs* \`${MAGIC_BURN_AMOUNT.toLocaleString()} $MAGIC\`
🔥 All tokens are *burned forever.*
  `);
});

// ─── /help ───────────────────────────────────────────────────────────────────

bot.command('help', (ctx) => {
  ctx.replyWithMarkdown(`
🗺️ *ASTRALIS — Command List*

*/create*       → Forge your hero
*/profile*      → View your character card
*/mission*      → Embark on a mission
*/collect*      → Collect mission rewards
*/inventory*    → View your items
*/equip* [name] → Equip an item
*/stats*        → Detailed stat breakdown
*/top*          → Hall of Fame leaderboard
*/help*         → This menu

━━━━━━━━━━━━━━━━━━━━━
🔥 Missions burn \`${MAGIC_BURN_AMOUNT.toLocaleString()} $MAGIC\`
⚔️ More features coming: Raids · Clans · PvP
  `);
});

// ─── /create ─────────────────────────────────────────────────────────────────

bot.command('create', (ctx) => {
  const userId = ctx.from.id;
  const existing = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (existing) {
    return ctx.reply(`You already have a character: ${CLASSES[existing.class].emoji} ${existing.class} (Lv.${existing.level})\n\nUse /profile to view it.`);
  }

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('⚔️ Warrior', 'class_Warrior'),
      Markup.button.callback('🔮 Mage', 'class_Mage'),
    ],
    [
      Markup.button.callback('🏹 Archer', 'class_Archer'),
      Markup.button.callback('🛡️ Tank', 'class_Tank'),
    ],
    [
      Markup.button.callback('✨ Healer', 'class_Healer'),
    ],
  ]);

  ctx.replyWithMarkdown(`
⚔️ *Choose Your Class*

*Warrior* — High HP & Attack. Frontline bruiser.
*Mage* — Arcane power. Devastating spells.
*Archer* — Speed & crits. Ranged precision.
*Tank* — Fortress defense. Immovable wall.
*Healer* — Divine support. Keeps allies alive.
  `, keyboard);
});

// Class selection callback
Object.keys(CLASSES).forEach((className) => {
  bot.action(`class_${className}`, (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Hero';
    const classData = CLASSES[className];

    db.prepare(`
      INSERT OR IGNORE INTO characters 
      (user_id, username, class, level, xp, hp, max_hp, attack, defense, magic_power, speed, magic_tokens)
      VALUES (?, ?, ?, 1, 0, ?, ?, ?, ?, ?, ?, 0)
    `).run(userId, username, className,
      classData.base.hp, classData.base.max_hp,
      classData.base.attack, classData.base.defense,
      classData.base.magic_power, classData.base.speed);

    ctx.editMessageText(
      `${classData.emoji} *${className}* chosen!\n\n${classData.description}\n\nYour legend begins.\nUse /profile to see your character card!`,
      { parse_mode: 'Markdown' }
    );
  });
});

// ─── /profile ────────────────────────────────────────────────────────────────

bot.command('profile', async (ctx) => {
  const userId = ctx.from.id;
  const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (!char) return ctx.reply('No character found. Use /create to forge your hero.');

  try {
    const imgBuffer = await generateCharacterCard(char);
    await ctx.replyWithPhoto({ source: imgBuffer }, {
      caption: `${CLASSES[char.class].emoji} *${char.username}* · Lv.${char.level} ${char.class}\n💰 ${(char.magic_tokens || 0).toLocaleString()} $MAGIC earned`,
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error('Card gen error:', err);
    ctx.reply('Error generating character card. Try /stats instead.');
  }
});

// ─── /stats ──────────────────────────────────────────────────────────────────

bot.command('stats', (ctx) => {
  const userId = ctx.from.id;
  const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (!char) return ctx.reply('No character. Use /create first.');

  const classData = CLASSES[char.class];
  const xpNeeded = xpForLevel(char.level);
  const equipped = db.prepare('SELECT * FROM inventory WHERE user_id = ? AND equipped = 1').all(userId);

  let equippedText = equipped.length
    ? equipped.map(i => `  ${RARITIES[i.rarity]?.emoji || '⚪'} ${i.item_name} (${i.rarity})`).join('\n')
    : '  None equipped';

  ctx.replyWithMarkdown(`
${classData.emoji} *${char.username}* — Lv.${char.level} ${char.class}

❤️ HP:        ${char.hp} / ${char.max_hp}
⚔️ Attack:    ${char.attack}
🛡️ Defense:   ${char.defense}
🔮 Magic:     ${char.magic_power}
💨 Speed:     ${char.speed}

📊 XP: ${char.xp} / ${xpNeeded}
🔥 $MAGIC Earned: ${(char.magic_tokens || 0).toLocaleString()}

🎽 *Equipped:*
${equippedText}
  `);
});

// ─── /mission ────────────────────────────────────────────────────────────────

bot.command('mission', (ctx) => {
  const userId = ctx.from.id;
  const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (!char) return ctx.reply('No character. Use /create first.');

  const active = db.prepare('SELECT * FROM missions WHERE user_id = ? AND collected = 0').get(userId);
  if (active) {
    const remaining = active.ends_at - Math.floor(Date.now() / 1000);
    if (remaining > 0) {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      return ctx.reply(`⏳ You're already on a mission: *${active.mission_name}*\n\nReturns in: ${mins}m ${secs}s\n\nUse /collect when ready!`, { parse_mode: 'Markdown' });
    }
    return ctx.reply(`✅ Mission complete! Use /collect to claim your rewards.`);
  }

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('⚡ Quick (15min)', 'mission_quick'),
      Markup.button.callback('⚔️ Normal (1hr)', 'mission_normal'),
    ],
    [
      Markup.button.callback('🔥 Hard (4hrs)', 'mission_hard'),
      Markup.button.callback('🌌 Epic (12hrs)', 'mission_epic'),
    ],
  ]);

  ctx.replyWithMarkdown(`
⚔️ *Choose Mission Difficulty*

Each mission costs *${MAGIC_BURN_AMOUNT.toLocaleString()} $MAGIC* (burned 🔥)

⚡ *Quick* — 15 min · ~30 XP · chance: Common gear
⚔️ *Normal* — 1 hr  · ~85 XP · chance: Uncommon gear  
🔥 *Hard* — 4 hrs · ~265 XP · chance: Rare gear
🌌 *Epic* — 12 hrs · ~850 XP · chance: Epic/Legendary gear
  `, keyboard);
});

// Mission difficulty callbacks
['quick', 'normal', 'hard', 'epic'].forEach((diff) => {
  bot.action(`mission_${diff}`, (ctx) => {
    const userId = ctx.from.id;
    const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
    if (!char) return ctx.answerCbQuery('No character found.');

    const active = db.prepare('SELECT * FROM missions WHERE user_id = ? AND collected = 0').get(userId);
    if (active) {
      const remaining = active.ends_at - Math.floor(Date.now() / 1000);
      if (remaining > 0) return ctx.answerCbQuery(`Still on a mission! Returns in ${Math.ceil(remaining/60)}min`);
    }

    const mission = randomMission(diff);
    const now = Math.floor(Date.now() / 1000);
    const ends = now + MISSION_DURATIONS[diff];

    db.prepare(`
      INSERT OR REPLACE INTO missions (user_id, mission_id, mission_name, difficulty, started_at, ends_at, collected)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).run(userId, mission.id, mission.name, diff, now, ends);

    // Log the burn (in production, verify on-chain)
    db.prepare('INSERT INTO burns (user_id, amount, reason) VALUES (?, ?, ?)').run(
      userId, MAGIC_BURN_AMOUNT, `Mission: ${mission.name}`
    );

    const durationStr = { quick: '15 minutes', normal: '1 hour', hard: '4 hours', epic: '12 hours' }[diff];

    ctx.editMessageText(
      `🔥 *${MAGIC_BURN_AMOUNT.toLocaleString()} $MAGIC BURNED*\n\n` +
      `${mission.name}\n\n` +
      `"${mission.desc}"\n\n` +
      `⏳ Duration: ${durationStr}\n` +
      `💰 Est. reward: ~${mission.tokens.toLocaleString()} $MAGIC + items\n\n` +
      `Use /collect when the mission ends!`,
      { parse_mode: 'Markdown' }
    );
  });
});

// ─── /collect ────────────────────────────────────────────────────────────────

bot.command('collect', async (ctx) => {
  const userId = ctx.from.id;
  const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (!char) return ctx.reply('No character. Use /create first.');

  const mission = db.prepare('SELECT * FROM missions WHERE user_id = ? AND collected = 0').get(userId);
  if (!mission) return ctx.reply('No active mission. Use /mission to embark!');

  const now = Math.floor(Date.now() / 1000);
  if (now < mission.ends_at) {
    const remaining = mission.ends_at - now;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return ctx.reply(`⏳ Not yet! Mission ends in ${mins}m ${secs}s`);
  }

  // Mark collected
  db.prepare('UPDATE missions SET collected = 1 WHERE user_id = ?').run(userId);

  // Get mission data
  const missionData = MISSIONS.find(m => m.id === mission.mission_id) || 
    { xp: 50, tokens: 1000, name: mission.mission_name };

  // XP reward (±20% variance)
  const xpGain = Math.floor(missionData.xp * (0.8 + Math.random() * 0.4));
  const tokenGain = Math.floor(missionData.tokens * (0.8 + Math.random() * 0.4));

  // Update XP + tokens
  db.prepare('UPDATE characters SET xp = xp + ?, magic_tokens = magic_tokens + ? WHERE user_id = ?')
    .run(xpGain, tokenGain, userId);

  // Roll item drop (70% chance)
  let itemText = '📦 No item dropped this time.';
  let droppedItem = null;
  if (Math.random() < 0.70) {
    droppedItem = rollItem(char.class, mission.difficulty);
    db.prepare(`
      INSERT INTO inventory (user_id, item_name, item_type, rarity, stat_bonus)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, droppedItem.name, droppedItem.type, droppedItem.rarity, droppedItem.statBonus);

    const rarityData = RARITIES[droppedItem.rarity];
    itemText = `${rarityData.emoji} *${droppedItem.rarity}* drop: *${droppedItem.name}*!`;
    if (droppedItem.rarity === 'Epic' || droppedItem.rarity === 'Legendary') {
      itemText = `🎉🎉 ${itemText} 🎉🎉`;
    }
  }

  // Level up check
  const newLevel = checkLevelUp(userId);
  const levelText = newLevel ? `\n\n🆙 *LEVEL UP! You are now Level ${newLevel}!* 🆙` : '';

  const updatedChar = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);

  ctx.replyWithMarkdown(`
✅ *Mission Complete!*
${mission.mission_name}

━━━━━━━━━━━━━━━━━━
✨ XP Gained:    +${xpGain}
🪙 $MAGIC:       +${tokenGain.toLocaleString()}

${itemText}
━━━━━━━━━━━━━━━━━━
📊 Total XP: ${updatedChar.xp} / ${xpForLevel(updatedChar.level)}
🔥 Total $MAGIC earned: ${(updatedChar.magic_tokens || 0).toLocaleString()}${levelText}

Use /mission to embark again!
Use /inventory to see your items.
  `);

  // Send updated character card after level up
  if (newLevel) {
    try {
      const imgBuffer = await generateCharacterCard(updatedChar);
      await ctx.replyWithPhoto({ source: imgBuffer }, {
        caption: `🆙 Level ${newLevel} ${CLASSES[updatedChar.class].emoji} ${updatedChar.class}!`,
        parse_mode: 'Markdown',
      });
    } catch (e) { /* silent */ }
  }
});

// ─── /inventory ──────────────────────────────────────────────────────────────

bot.command('inventory', (ctx) => {
  const userId = ctx.from.id;
  const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (!char) return ctx.reply('No character. Use /create first.');

  const items = db.prepare('SELECT * FROM inventory WHERE user_id = ? ORDER BY rarity DESC, id DESC LIMIT 30').all(userId);
  if (!items.length) return ctx.reply('📦 Inventory empty. Go on a mission to earn items!');

  const grouped = {};
  items.forEach(item => {
    const key = item.rarity;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const rarityOrder = ['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
  let text = `🎒 *${char.username}'s Inventory* (${items.length} items)\n\n`;

  rarityOrder.forEach(rarity => {
    if (!grouped[rarity]) return;
    const r = RARITIES[rarity];
    text += `${r.emoji} *${rarity}*\n`;
    grouped[rarity].forEach(item => {
      const eq = item.equipped ? ' ✅' : '';
      text += `  • ${item.item_name} [${item.item_type}]${eq}\n`;
    });
    text += '\n';
  });

  text += `\nUse /equip [item name] to equip an item.`;
  ctx.replyWithMarkdown(text);
});

// ─── /equip ──────────────────────────────────────────────────────────────────

bot.command('equip', (ctx) => {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(' ').slice(1).join(' ').trim();
  if (!args) return ctx.reply('Usage: /equip [item name]\nExample: /equip Iron Sword');

  const char = db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
  if (!char) return ctx.reply('No character. Use /create first.');

  // Find item in inventory (case-insensitive)
  const item = db.prepare(`
    SELECT * FROM inventory WHERE user_id = ? AND LOWER(item_name) LIKE LOWER(?) LIMIT 1
  `).get(userId, `%${args}%`);

  if (!item) return ctx.reply(`Item "${args}" not found in your inventory. Check /inventory.`);
  if (item.equipped) return ctx.reply(`${item.item_name} is already equipped!`);

  // Unequip same slot
  db.prepare('UPDATE inventory SET equipped = 0 WHERE user_id = ? AND item_type = ?').run(userId, item.item_type);

  // Equip new item
  db.prepare('UPDATE inventory SET equipped = 1 WHERE id = ?').run(item.id);

  // Apply stat bonus
  const bonus = JSON.parse(item.stat_bonus || '{}');
  const updates = Object.entries(bonus).map(([stat, val]) => `${stat} = ${stat} + ${val}`).join(', ');
  if (updates) {
    db.prepare(`UPDATE characters SET ${updates} WHERE user_id = ?`).run(userId);
  }

  const rarityData = RARITIES[item.rarity];
  ctx.replyWithMarkdown(`
${rarityData.emoji} *${item.item_name}* equipped! (${item.rarity})

Stats gained: ${Object.entries(bonus).map(([k,v]) => `+${v} ${k}`).join(', ') || 'none'}

Use /profile to see your updated character card.
  `);
});

// ─── /top ────────────────────────────────────────────────────────────────────

bot.command('top', (ctx) => {
  const leaders = db.prepare(`
    SELECT username, class, level, xp, magic_tokens
    FROM characters ORDER BY level DESC, xp DESC LIMIT 10
  `).all();

  if (!leaders.length) return ctx.reply('No heroes yet. Be the first!');

  const medals = ['🥇', '🥈', '🥉'];
  let text = `🏆 *ASTRALIS — Hall of Fame*\n\n`;

  leaders.forEach((h, i) => {
    const medal = medals[i] || `${i + 1}.`;
    const classData = CLASSES[h.class];
    text += `${medal} ${classData?.emoji || ''} *${h.username}* — Lv.${h.level} ${h.class}\n`;
    text += `    🔥 ${(h.magic_tokens || 0).toLocaleString()} $MAGIC earned\n\n`;
  });

  text += `\n$MAGIC · ASTRALIS`;
  ctx.replyWithMarkdown(text);
});

// ─── ERROR HANDLER ───────────────────────────────────────────────────────────

bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('⚡ An error occurred. Try again!').catch(() => {});
});

// ─── LAUNCH ──────────────────────────────────────────────────────────────────

bot.launch().then(() => {
  console.log('🌌 ASTRALIS RPG Bot is live!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
