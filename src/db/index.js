const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config');

const dbPath = config.DATABASE_PATH;
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
const initSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      username TEXT,
      wallet_address TEXT,
      magic_balance INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS heroes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      class TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      hp INTEGER DEFAULT 100,
      max_hp INTEGER DEFAULT 100,
      attack INTEGER DEFAULT 10,
      defense INTEGER DEFAULT 5,
      magic INTEGER DEFAULT 5,
      speed INTEGER DEFAULT 10,
      crit INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      difficulty TEXT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ends_at DATETIME,
      collected INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_name TEXT,
      rarity TEXT,
      stat_type TEXT,
      stat_value INTEGER,
      level INTEGER DEFAULT 1,
      equipped INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      leader_id INTEGER,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      raid_boss TEXT,
      raid_hp INTEGER DEFAULT 0,
      raid_max_hp INTEGER DEFAULT 100,
      raid_ends_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leader_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS guild_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id INTEGER,
      user_id INTEGER,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS pvp_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attacker_id INTEGER,
      defender_id INTEGER,
      winner_id INTEGER,
      magic_won INTEGER DEFAULT 0,
      fought_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (attacker_id) REFERENCES users(user_id),
      FOREIGN KEY (defender_id) REFERENCES users(user_id),
      FOREIGN KEY (winner_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS market_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER,
      item_id INTEGER,
      price INTEGER,
      listed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(user_id),
      FOREIGN KEY (item_id) REFERENCES inventory(id)
    );

    CREATE TABLE IF NOT EXISTS burn_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount INTEGER,
      reason TEXT,
      burned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS cooldowns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      command TEXT,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
    CREATE INDEX IF NOT EXISTS idx_heroes_user_id ON heroes(user_id);
    CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
    CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
    CREATE INDEX IF NOT EXISTS idx_pvp_log_players ON pvp_log(attacker_id, defender_id);
    CREATE INDEX IF NOT EXISTS idx_cooldowns_expires ON cooldowns(expires_at);
  `);
};

initSchema();

module.exports = db;
