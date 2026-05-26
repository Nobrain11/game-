require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const Database = require('better-sqlite3');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required');

const bot = new Telegraf(BOT_TOKEN);
const db = new Database(path.join(__dirname, 'astralis.db'));

// ─── DB SETUP ───────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS characters (
    user_id     INTEGER PRIMARY KEY,
    username    TEXT,
    class       TEXT,
    level       INTEGER DEFAULT 1,
    xp          INTEGER DEFAULT 0,
    hp          INTEGER DEFAULT 100,
    max_hp      INTEGER DEFAULT 100,
    attack      INTEGER DEFAULT 10,
    defense     INTEGER DEFAULT 5,
    magic       INTEGER DEFAULT 5,
    speed       INTEGER DEFAULT 10,
    crit        INTEGER DEFAULT 5,
    equipped    TEXT DEFAULT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS missions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER,
    difficulty  TEXT,
    started_at  DATETIME,
    ends_at     DATETIME,
    collected   INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER,
    item_name   TEXT,
    rarity      TEXT,
    stat_type   TEXT,
    stat_value  INTEGER,
    emoji       TEXT,
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS burns (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER,
    amount      INTEGER DEFAULT 100000,
    mission_id  INTEGER,
    burned_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const CLASSES = {
  warrior: {
    emoji: '⚔️', label: 'Warrior',
    desc: 'Frontline bruiser with high HP & Attack',
    stats: { hp: 140, max_hp: 140, attack: 18, defense: 10, magic: 3, speed: 8, crit: 6 }
  },
  mage: {
    emoji: '🔮', label: 'Mage',
    desc: 'Burst damage specialist with high Magic',
    stats: { hp: 80, max_hp: 80, attack: 8, defense: 4, magic: 22, speed: 12, crit: 10 }
  },
  archer: {
    emoji: '🏹', label: 'Archer',
    desc: 'Ranged precision with Speed & Crit',
    stats: { hp: 95, max_hp: 95, attack: 14, defense: 6, magic: 5, speed: 18, crit: 15 }
  },
  tank: {
    emoji: '🛡️', label: 'Tank',
    desc: 'Damage absorber with Defense & HP',
    stats: { hp: 180, max_hp: 180, attack: 10, defense: 20, magic: 2, speed: 5, crit: 3 }
  },
  healer: {
    emoji: '✨', label: 'Healer',
    desc: 'Divine utility with Magic & Support',
    stats: { hp: 100, max_hp: 100, attack: 7, defense: 8, magic: 18, speed: 11, crit: 7 }
  }
};

const MISSIONS = {
  quick:  { emoji: '⚡', label: 'Quick',  duration: 15 * 60,     xp: [25, 35],   difficulty: 1 },
  normal: { emoji: '⚔️', label: 'Normal', duration: 60 * 60,     xp: [75, 100],  difficulty: 2 },
  hard:   { emoji: '🔥', label: 'Hard',   duration: 4 * 60 * 60,  xp: [230, 300], difficulty: 3 },
  epic:   { emoji: '🌌', label: 'Epic',   duration: 12 * 60 * 60, xp: [750, 950], difficulty: 4 }
};

const RARITIES = [
  { name: 'Common',    emoji: '⚪', weight: 60 },
  { name: 'Uncommon',  emoji: '🟢', weight: 25 },
  { name: 'Rare',      emoji: '🔵', weight: 10 },
  { name: 'Epic',      emoji: '🟣', weight: 4  },
  { name: 'Legendary', emoji: '🟡', weight: 1  }
];

const ITEM_POOLS = {
  quick:  ['Common', 'Uncommon'],
  normal: ['Common', 'Uncommon', 'Rare'],
  hard:   ['Uncommon', 'Rare', 'Epic'],
  epic:   ['Rare', 'Epic', 'Legendary']
};

const ITEM_NAMES = {
  weapon:  ['Shadowblade', 'Voidstaff', 'Stormbow', 'Ironmaul', 'Crystalwand', 'Flamedagger', 'Soulspear', 'Frostaxe'],
  armor:   ['Duskplate', 'Spiritweave', 'Shadowmail', 'Starforged Helm', 'Voidcloak', 'Runeshield', 'Celestial Vest'],
  trinket: ['Amulet of Astralis', 'Chaos Orb', 'Eclipse Ring', 'Ember Shard', 'Void Crystal', 'Star Fragment', 'Dark Sigil']
};

const STAT_TYPES = ['attack', 'defense', 'magic', 'speed', 'crit', 'hp'];

const MAGIC_BURN_AMOUNT = 100000;

// ─── CLASS ARTWORK URLs ───────────────────────────────────────────────────────
// These are public fantasy art images — swap for your own if desired.
// Using Lexica / stable diffusion style public images via direct URL.
const CLASS_IMAGES = {
  // Copy your images into the same folder as bot.js with these exact filenames:
  // img_warrior.png   → Crystal Era Warrior  (IMG_2746.png)
  // img_mage.jpeg     → Arcane Mage          (IMG_2754.jpeg)
  // img_archer.jpeg   → Crystal Archer       (IMG_2745.jpeg)
  // img_tank.png      → Crystal Army Cmdr    (IMG_2747.png)
  // img_healer.jpeg   → Healer/Mage staff    (IMG_2755.jpeg)
  // img_realm.jpeg    → Astralis Warrior     (IMG_2753.jpeg) — /start splash
  warrior: path.join(__dirname, 'img_warrior.png'),
  mage:    path.join(__dirname, 'img_mage.jpeg'),
  archer:  path.join(__dirname, 'img_archer.jpeg'),
  tank:    path.join(__dirname, 'img_tank.png'),
  healer:  path.join(__dirname, 'img_healer.jpeg'),
  realm:   path.join(__dirname, 'img_realm.jpeg'),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function xpForLevel(level) { return Math.floor(100 * Math.pow(1.4, level - 1)); }

function rollRarity(pool) {
  const available = RARITIES.filter(r => pool.includes(r.name));
  const total = available.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of available) {
    roll -= r.weight;
    if (roll <= 0) return r;
  }
  return available[0];
}

function rollItem(difficulty) {
  const pool = ITEM_POOLS[difficulty];
  const rarity = rollRarity(pool);
  const type = ['weapon', 'armor', 'trinket'][Math.floor(Math.random() * 3)];
  const names = ITEM_NAMES[type];
  const name = names[Math.floor(Math.random() * names.length)];
  const statType = STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)];
  const rarityMult = { Common: 1, Uncommon: 1.5, Rare: 2.5, Epic: 4, Legendary: 7 };
  const statValue = Math.floor((Math.random() * 5 + 3) * rarityMult[rarity.name]);
  return { item_name: name, rarity: rarity.name, stat_type: statType, stat_value: statValue, emoji: rarity.emoji };
}

function getChar(userId) {
  return db.prepare('SELECT * FROM characters WHERE user_id = ?').get(userId);
}

function levelUpCheck(char) {
  let { level, xp } = char;
  const msgs = [];
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
    msgs.push(`\n🎉 *LEVEL UP!* You are now Level *${level}*!`);
  }
  if (msgs.length > 0) {
    db.prepare('UPDATE characters SET level=?, xp=? WHERE user_id=?').run(level, xp, char.user_id);
  }
  return msgs.join('');
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function hpBar(current, max, length = 10) {
  const filled = Math.round((current / max) * length);
  return '█'.repeat(filled) + '░'.repeat(length - filled);
}

function xpBar(xp, level, length = 10) {
  const needed = xpForLevel(level);
  const filled = Math.round((xp / needed) * length);
  return '▓'.repeat(filled) + '░'.repeat(length - filled);
}

// ─── /start ───────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const char = getChar(ctx.from.id);
  const hasChar = !!char;

  // Send atmospheric realm image first
  await ctx.replyWithPhoto(
    { source: CLASS_IMAGES.realm },
    {
      caption:
        `🌌 *Welcome to ASTRALIS*\n` +
        `_The realm of eternal glory_\n\n` +
        `${hasChar
          ? `⚔️ Welcome back, *${ctx.from.first_name}*!\n\nUse /profile to view your hero.`
          : `A new adventure begins...\n\nUse /create to forge your hero and enter the realm.`
        }\n\n` +
        `📜 Type /help for all commands.`,
      parse_mode: 'Markdown'
    }
  );
});

// ─── /help ────────────────────────────────────────────────────────────────────
bot.command('help', (ctx) => {
  ctx.replyWithMarkdown(
    `🌌 *ASTRALIS — Command Guide*\n\n` +
    `⚔️ *Character*\n` +
    `/create — Create your hero\n` +
    `/profile — View character card\n` +
    `/stats — Detailed stat breakdown\n\n` +
    `🗺️ *Missions*\n` +
    `/mission — Send on a mission\n` +
    `/collect — Collect mission rewards\n\n` +
    `🎒 *Items*\n` +
    `/inventory — View & equip all items\n\n` +
    `🏆 *Social*\n` +
    `/top — Leaderboard\n\n` +
    `💡 Every mission burns *100,000 $MAGIC*`
  );
});

// ─── /create ─────────────────────────────────────────────────────────────────
bot.command('create', async (ctx) => {
  const existing = getChar(ctx.from.id);
  if (existing) {
    return ctx.replyWithMarkdown(
      `⚠️ You already have a *${CLASSES[existing.class].emoji} ${CLASSES[existing.class].label}*!\n\nUse /profile to view them.`
    );
  }

  const buttons = Object.entries(CLASSES).map(([key, c]) =>
    [Markup.button.callback(`${c.emoji} ${c.label}`, `create_class_${key}`)]
  );

  // Show warrior art to spark the fantasy
  await ctx.replyWithPhoto(
    { source: CLASS_IMAGES.warrior },
    {
      caption:
        `🌌 *Choose Your Class*\n\n` +
        Object.entries(CLASSES).map(([, c]) => `${c.emoji} *${c.label}* — ${c.desc}`).join('\n') +
        `\n\n_Your destiny awaits..._`,
      parse_mode: 'Markdown',
      reply_markup: Markup.inlineKeyboard(buttons).reply_markup
    }
  );
});

Object.keys(CLASSES).forEach(cls => {
  bot.action(`create_class_${cls}`, async (ctx) => {
    const existing = getChar(ctx.from.id);
    if (existing) return ctx.answerCbQuery('You already have a character!');

    const c = CLASSES[cls];
    const s = c.stats;
    db.prepare(`
      INSERT INTO characters (user_id, username, class, level, xp, hp, max_hp, attack, defense, magic, speed, crit)
      VALUES (?, ?, ?, 1, 0, ?, ?, ?, ?, ?, ?, ?)
    `).run(ctx.from.id, ctx.from.username || ctx.from.first_name, cls, s.hp, s.max_hp, s.attack, s.defense, s.magic, s.speed, s.crit);

    await ctx.answerCbQuery(`${c.emoji} ${c.label} created!`);

    // Edit the caption on the class-select photo message
    await ctx.editMessageCaption(
      `🌌 *Hero Forged!*\n\n` +
      `${c.emoji} *${c.label}* — ${c.desc}\n\n` +
      `❤️ HP: ${s.hp}/${s.max_hp}\n` +
      `⚔️ ATK: ${s.attack}  🛡️ DEF: ${s.defense}\n` +
      `🔮 MAG: ${s.magic}  💨 SPD: ${s.speed}  🎯 CRIT: ${s.crit}%\n\n` +
      `_Your journey has begun. Use /mission to embark!_`,
      undefined,
      { parse_mode: 'Markdown' }
    );

    // Send the class-specific hero image
    await ctx.replyWithPhoto(
      { source: CLASS_IMAGES[cls] || CLASS_IMAGES.warrior },
      {
        caption: `${c.emoji} *Your ${c.label} awakens...*\n_The realm trembles at your arrival._`,
        parse_mode: 'Markdown'
      }
    );
  });
});

// ─── /profile ─────────────────────────────────────────────────────────────────
bot.command('profile', (ctx) => {
  const char = getChar(ctx.from.id);
  if (!char) return ctx.replyWithMarkdown(`❌ No hero found. Use /create to begin.`);

  const c = CLASSES[char.class];
  const xpNeeded = xpForLevel(char.level);
  const equipped = char.equipped
    ? db.prepare('SELECT * FROM inventory WHERE id = ?').get(char.equipped)
    : null;

  const activeMission = db.prepare(
    'SELECT * FROM missions WHERE user_id = ? AND collected = 0 ORDER BY id DESC LIMIT 1'
  ).get(ctx.from.id);

  let missionStatus = '🏕️ Resting';
  if (activeMission) {
    const now = Date.now() / 1000;
    const endsAt = new Date(activeMission.ends_at).getTime() / 1000;
    if (now < endsAt) {
      missionStatus = `${MISSIONS[activeMission.difficulty].emoji} On Mission (${formatTime(Math.ceil(endsAt - now))} left)`;
    } else {
      missionStatus = `✅ Mission Complete — /collect`;
    }
  }

  ctx.replyWithMarkdown(
    `╔══════════════════════╗\n` +
    `  🌌 *ASTRALIS HERO CARD*\n` +
    `╚══════════════════════╝\n\n` +
    `${c.emoji} *${char.username || 'Hero'}* — ${c.label}\n` +
    `⭐ Level *${char.level}*  |  🆔 ${ctx.from.id}\n\n` +
    `❤️ HP  [${hpBar(char.hp, char.max_hp)}] ${char.hp}/${char.max_hp}\n` +
    `✨ XP  [${xpBar(char.xp, char.level)}] ${char.xp}/${xpNeeded}\n\n` +
    `⚔️ ATK *${char.attack}*   🛡️ DEF *${char.defense}*\n` +
    `🔮 MAG *${char.magic}*   💨 SPD *${char.speed}*   🎯 CRIT *${char.crit}%*\n\n` +
    `🧤 Equipped: ${equipped ? `${equipped.emoji} ${equipped.item_name} (+${equipped.stat_value} ${equipped.stat_type})` : 'None'}\n` +
    `🗺️ Status: ${missionStatus}`
  );
});

// ─── /stats ───────────────────────────────────────────────────────────────────
bot.command('stats', (ctx) => {
  const char = getChar(ctx.from.id);
  if (!char) return ctx.replyWithMarkdown('❌ No hero found. Use /create to begin.');

  const c = CLASSES[char.class];
  const itemCount = db.prepare('SELECT COUNT(*) as c FROM inventory WHERE user_id = ?').get(ctx.from.id).c;
  const missionCount = db.prepare('SELECT COUNT(*) as c FROM missions WHERE user_id = ? AND collected = 1').get(ctx.from.id).c;
  const burnCount = db.prepare('SELECT COUNT(*) as c FROM burns WHERE user_id = ?').get(ctx.from.id).c;

  ctx.replyWithMarkdown(
    `📊 *${c.emoji} ${char.username} — Stats Breakdown*\n\n` +
    `🎖️ *Level ${char.level}* — ${char.xp}/${xpForLevel(char.level)} XP to next level\n\n` +
    `*Base Stats:*\n` +
    `❤️  HP:      ${char.hp} / ${char.max_hp}\n` +
    `⚔️  Attack:  ${char.attack}\n` +
    `🛡️  Defense: ${char.defense}\n` +
    `🔮  Magic:   ${char.magic}\n` +
    `💨  Speed:   ${char.speed}\n` +
    `🎯  Crit:    ${char.crit}%\n\n` +
    `*Career:*\n` +
    `📦 Items collected: ${itemCount}\n` +
    `🗺️ Missions done: ${missionCount}\n` +
    `🔥 $MAGIC burned: ${(burnCount * MAGIC_BURN_AMOUNT).toLocaleString()}`
  );
});

// ─── /mission ─────────────────────────────────────────────────────────────────
bot.command('mission', (ctx) => {
  const char = getChar(ctx.from.id);
  if (!char) return ctx.replyWithMarkdown('❌ No hero found. Use /create to begin.');

  const activeMission = db.prepare(
    'SELECT * FROM missions WHERE user_id = ? AND collected = 0 ORDER BY id DESC LIMIT 1'
  ).get(ctx.from.id);

  if (activeMission) {
    const now = Date.now() / 1000;
    const endsAt = new Date(activeMission.ends_at).getTime() / 1000;
    if (now < endsAt) {
      return ctx.replyWithMarkdown(
        `⚠️ *Already on a mission!*\n\n` +
        `${MISSIONS[activeMission.difficulty].emoji} *${MISSIONS[activeMission.difficulty].label}* mission in progress.\n` +
        `⏳ Returns in: *${formatTime(Math.ceil(endsAt - now))}*\n\n` +
        `_Use /collect once it completes._`
      );
    } else {
      return ctx.replyWithMarkdown(`✅ Your mission is complete! Use /collect to claim your rewards.`);
    }
  }

  const buttons = Object.entries(MISSIONS).map(([key, m]) =>
    [Markup.button.callback(`${m.emoji} ${m.label} (${formatTime(m.duration)}) — ${m.xp[0]}-${m.xp[1]} XP`, `mission_start_${key}`)]
  );

  ctx.replyWithMarkdown(
    `🗺️ *Choose a Mission*\n\n` +
    Object.entries(MISSIONS).map(([, m]) =>
      `${m.emoji} *${m.label}* — ${formatTime(m.duration)} | ${m.xp[0]}–${m.xp[1]} XP`
    ).join('\n') +
    `\n\n🔥 All missions burn *100,000 $MAGIC*\n_Choose wisely, hero._`,
    Markup.inlineKeyboard(buttons)
  );
});

Object.keys(MISSIONS).forEach(diff => {
  bot.action(`mission_start_${diff}`, (ctx) => {
    const char = getChar(ctx.from.id);
    if (!char) return ctx.answerCbQuery('No character found!');

    const activeMission = db.prepare(
      'SELECT * FROM missions WHERE user_id = ? AND collected = 0 ORDER BY id DESC LIMIT 1'
    ).get(ctx.from.id);

    if (activeMission) return ctx.answerCbQuery('Already on a mission!');

    const m = MISSIONS[diff];
    const now = new Date();
    const endsAt = new Date(now.getTime() + m.duration * 1000);

    const missionResult = db.prepare(
      'INSERT INTO missions (user_id, difficulty, started_at, ends_at) VALUES (?, ?, ?, ?)'
    ).run(ctx.from.id, diff, now.toISOString(), endsAt.toISOString());

    db.prepare('INSERT INTO burns (user_id, amount, mission_id) VALUES (?, ?, ?)')
      .run(ctx.from.id, MAGIC_BURN_AMOUNT, missionResult.lastInsertRowid);

    ctx.answerCbQuery(`${m.emoji} Mission started!`);
    ctx.editMessageText(
      `🌌 *Mission Started!*\n\n` +
      `${m.emoji} *${m.label}* difficulty\n` +
      `⏳ Duration: *${formatTime(m.duration)}*\n` +
      `✨ XP reward: *${m.xp[0]}–${m.xp[1]}*\n` +
      `🔥 Burned: *${MAGIC_BURN_AMOUNT.toLocaleString()} $MAGIC*\n\n` +
      `Your hero ventures into the realm...\n` +
      `_Use /collect when the mission ends._`,
      { parse_mode: 'Markdown' }
    );
  });
});

// ─── /collect ─────────────────────────────────────────────────────────────────
bot.command('collect', (ctx) => {
  const char = getChar(ctx.from.id);
  if (!char) return ctx.replyWithMarkdown('❌ No hero found. Use /create to begin.');

  const mission = db.prepare(
    'SELECT * FROM missions WHERE user_id = ? AND collected = 0 ORDER BY id DESC LIMIT 1'
  ).get(ctx.from.id);

  if (!mission) return ctx.replyWithMarkdown('🏕️ No active mission. Use /mission to embark!');

  const now = Date.now() / 1000;
  const endsAt = new Date(mission.ends_at).getTime() / 1000;

  if (now < endsAt) {
    return ctx.replyWithMarkdown(
      `⏳ Mission still in progress!\n\n` +
      `Returns in: *${formatTime(Math.ceil(endsAt - now))}*`
    );
  }

  // Grant XP
  const m = MISSIONS[mission.difficulty];
  const xpGained = Math.floor(Math.random() * (m.xp[1] - m.xp[0] + 1)) + m.xp[0];
  const newXp = char.xp + xpGained;
  db.prepare('UPDATE characters SET xp = ? WHERE user_id = ?').run(newXp, ctx.from.id);

  const updatedChar = getChar(ctx.from.id);
  const lvlUpMsg = levelUpCheck(updatedChar);

  // Roll item (70% chance)
  let itemMsg = '🎒 No item drop this time.';
  if (Math.random() < 0.7) {
    const item = rollItem(mission.difficulty);
    db.prepare(
      'INSERT INTO inventory (user_id, item_name, rarity, stat_type, stat_value, emoji) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(ctx.from.id, item.item_name, item.rarity, item.stat_type, item.stat_value, item.emoji);
    itemMsg = `${item.emoji} *${item.rarity}* drop: *${item.item_name}* (+${item.stat_value} ${item.stat_type})`;
  }

  db.prepare('UPDATE missions SET collected = 1 WHERE id = ?').run(mission.id);

  ctx.replyWithMarkdown(
    `✅ *Mission Complete!*\n\n` +
    `${m.emoji} *${m.label}* mission finished!\n\n` +
    `✨ XP gained: *+${xpGained}*\n` +
    `${itemMsg}` +
    `${lvlUpMsg}\n\n` +
    `_Use /inventory to manage your loot._`
  );
});

// ─── /inventory ───────────────────────────────────────────────────────────────
// Shows a visual bag with inline [Equip] buttons per item — no typing needed.

const ITEMS_PER_PAGE = 5;

function buildInventoryMessage(char, items, page) {
  const rarityOrder = { Legendary: 0, Epic: 1, Rare: 2, Uncommon: 3, Common: 4 };
  const sorted = [...items].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const pageItems = sorted.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const lines = pageItems.map(it => {
    const isEquipped = char.equipped == it.id;
    return (
      `${it.emoji} *${it.item_name}*  [${it.rarity}]` +
      `\n   📈 +${it.stat_value} ${it.stat_type}` +
      `${isEquipped ? '   ✅ *Equipped*' : ''}`
    );
  });

  const header =
    `🎒 *Inventory* — ${items.length} item${items.length !== 1 ? 's' : ''}\n` +
    `Page ${page + 1} / ${totalPages}\n` +
    `───────────────────\n`;

  return {
    text: header + (lines.length ? lines.join('\n\n') : '_No items on this page._'),
    pageItems,
    totalPages,
    page
  };
}

function buildInventoryKeyboard(char, pageItems, page, totalPages) {
  const rows = pageItems.map(it => {
    const isEquipped = char.equipped == it.id;
    const label = isEquipped
      ? `✅ ${it.item_name} (equipped)`
      : `🧤 Equip ${it.item_name}`;
    return [Markup.button.callback(label, `inv_equip_${it.id}`)];
  });

  const navRow = [];
  if (page > 0)             navRow.push(Markup.button.callback('◀️ Prev', `inv_page_${page - 1}`));
  if (page < totalPages - 1) navRow.push(Markup.button.callback('Next ▶️', `inv_page_${page + 1}`));
  if (navRow.length) rows.push(navRow);

  return Markup.inlineKeyboard(rows);
}

bot.command('inventory', (ctx) => {
  const char = getChar(ctx.from.id);
  if (!char) return ctx.replyWithMarkdown('❌ No hero found. Use /create to begin.');

  const items = db.prepare('SELECT * FROM inventory WHERE user_id = ? ORDER BY obtained_at DESC').all(ctx.from.id);
  if (!items.length) {
    return ctx.replyWithMarkdown(
      `🎒 *Your bag is empty!*\n\n` +
      `Complete missions to earn weapons, armor & trinkets.\n\n` +
      `_Use /mission to venture out._`
    );
  }

  const { text, pageItems, totalPages, page } = buildInventoryMessage(char, items, 0);
  const keyboard = buildInventoryKeyboard(char, pageItems, page, totalPages);

  ctx.replyWithMarkdown(text, keyboard);
});

// Pagination callback
bot.action(/^inv_page_(\d+)$/, (ctx) => {
  const page = parseInt(ctx.match[1]);
  const char = getChar(ctx.from.id);
  if (!char) return ctx.answerCbQuery('No character found!');

  const items = db.prepare('SELECT * FROM inventory WHERE user_id = ? ORDER BY obtained_at DESC').all(ctx.from.id);
  const { text, pageItems, totalPages } = buildInventoryMessage(char, items, page);
  const keyboard = buildInventoryKeyboard(char, pageItems, page, totalPages);

  ctx.editMessageText(text, { parse_mode: 'Markdown', ...keyboard });
  ctx.answerCbQuery();
});

// Equip callback — tap the button, item equips instantly
bot.action(/^inv_equip_(\d+)$/, (ctx) => {
  const itemId = parseInt(ctx.match[1]);
  const char = getChar(ctx.from.id);
  if (!char) return ctx.answerCbQuery('No character found!');

  const item = db.prepare('SELECT * FROM inventory WHERE id = ? AND user_id = ?').get(itemId, ctx.from.id);
  if (!item) return ctx.answerCbQuery('Item not found!');

  // Already equipped — do nothing but confirm
  if (char.equipped == itemId) {
    return ctx.answerCbQuery(`${item.emoji} Already equipped!`);
  }

  // Remove old equipped stat bonus
  if (char.equipped) {
    const old = db.prepare('SELECT * FROM inventory WHERE id = ?').get(char.equipped);
    if (old && STAT_TYPES.includes(old.stat_type)) {
      db.prepare(`UPDATE characters SET ${old.stat_type} = MAX(0, ${old.stat_type} - ?) WHERE user_id = ?`)
        .run(old.stat_value, ctx.from.id);
    }
  }

  // Apply new item stat
  if (STAT_TYPES.includes(item.stat_type)) {
    db.prepare(`UPDATE characters SET ${item.stat_type} = ${item.stat_type} + ? WHERE user_id = ?`)
      .run(item.stat_value, ctx.from.id);
  }
  db.prepare('UPDATE characters SET equipped = ? WHERE user_id = ?').run(item.id, ctx.from.id);

  ctx.answerCbQuery(`${item.emoji} ${item.item_name} equipped! +${item.stat_value} ${item.stat_type}`);

  // Refresh the inventory message in place
  const updatedChar = getChar(ctx.from.id);
  const items = db.prepare('SELECT * FROM inventory WHERE user_id = ? ORDER BY obtained_at DESC').all(ctx.from.id);

  // Determine current page from message text (fall back to 0)
  let currentPage = 0;
  try {
    const match = ctx.callbackQuery.message.text.match(/Page (\d+) \//);
    if (match) currentPage = parseInt(match[1]) - 1;
  } catch (_) {}

  const { text, pageItems, totalPages } = buildInventoryMessage(updatedChar, items, currentPage);
  const keyboard = buildInventoryKeyboard(updatedChar, pageItems, currentPage, totalPages);

  ctx.editMessageText(text, { parse_mode: 'Markdown', ...keyboard });
});

// ─── /top ─────────────────────────────────────────────────────────────────────
bot.command('top', (ctx) => {
  const heroes = db.prepare(
    'SELECT * FROM characters ORDER BY level DESC, xp DESC LIMIT 10'
  ).all();

  if (!heroes.length) return ctx.replyWithMarkdown('🏆 No heroes yet. Be the first!');

  const medals = ['🥇', '🥈', '🥉'];
  const lines = heroes.map((h, i) => {
    const c = CLASSES[h.class];
    const medal = medals[i] || `*${i + 1}.*`;
    return `${medal} ${c.emoji} *${h.username || 'Hero'}* — Lvl *${h.level}* ${c.label}`;
  });

  ctx.replyWithMarkdown(
    `🏆 *ASTRALIS Leaderboard*\n\n` +
    lines.join('\n') +
    `\n\n_Rise through the ranks, hero._`
  );
});

// ─── LAUNCH ───────────────────────────────────────────────────────────────────
console.log('🌌 ASTRALIS RPG Bot starting...');
bot.launch().then(() => console.log('✅ Bot is live!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
