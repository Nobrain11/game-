# ASTRALIS RPG Bot - Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Telegram Bot Token from BotFather

## Installation Steps

### 1. Get Your Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to create a new bot
4. Copy your **BOT_TOKEN** (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### 2. Environment Configuration

Open `.env` and replace the placeholder:

```env
BOT_TOKEN=your_actual_bot_token_here
```

### 3. Install Dependencies

The project uses `better-sqlite3` for database management. Due to native binding requirements in certain environments, you have two options:

**Option A: Standard Installation (Recommended)**
```bash
npm install
```

**Option B: Skip Optional Dependencies**
If you encounter build issues:
```bash
npm install --no-optional
```

### 4. Database Initialization

The SQLite database (`astralis.db`) will be created automatically on first run with the following tables:
- `characters` - Player profiles and stats
- `missions` - Active/completed missions
- `inventory` - Items owned by players
- `burns` - Burned game tokens
- `guilds` - Guild data
- `pvp_log` - PvP battle history
- `market` - Player marketplace listings
- `quest_completions` - Daily quest tracking

## Running the Bot

### Local Testing

```bash
npm start
```

The bot will start and log "Bot running" once connected. In Telegram, find your bot and send `/start`.

### Available Commands

- `/start` - Initialize character
- `/create [class]` - Create character (warrior, mage, archer, tank, healer, draconid, rogue, chrono, crystalforged)
- `/stats` - View character stats
- `/mission [difficulty]` - Start mission (quick, normal, hard, epic)
- `/collect` - Collect mission rewards
- `/inventory` - View items
- `/arena` - PvP arena menu
- `/guild` - Guild management
- `/market` - Buy/sell items
- `/daily` - View daily quests
- `/profile` - View profile
- `/help` - Show all commands

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variable in Vercel settings:
   - Key: `BOT_TOKEN`
   - Value: Your actual bot token
4. Deploy

### Railway/Heroku Deployment

1. Set BOT_TOKEN environment variable
2. npm install should work with prebuilt binaries
3. Run: `npm start`

## Troubleshooting

### "BOT_TOKEN is required"
- Ensure `.env` file exists and contains your token
- Restart the bot after updating `.env`

### Database Lock Errors
- The database is actively in use. Wait a moment and try again.
- Check if another instance of the bot is running.

### better-sqlite3 Build Fails
- Ensure you have Python 3 installed
- Try: `npm install --build-from-source`
- Or use: `npm install --no-optional` and switch to sqlite3

## Game Features

### Character System
- 9 unique classes with different stat distributions
- Level progression through XP
- Equipment upgrades (Common → Legendary)
- Class-specific artwork

### Missions
- Quick (15 min)
- Normal (1 hour)
- Hard (4 hours)
- Epic (12 hours)
- Rewards: XP and items

### Items
- 5 rarity tiers
- 3 categories: weapon, armor, trinket
- Stat bonuses for upgrades
- Marketplace for trading

### PvP Arena
- 1v1 battles
- Damage calculation based on stats
- Streak tracking
- Tournament brackets

### Guilds
- Leader management
- Raid boss system
- Guild XP progression
- Shared treasury

### Daily Quests
- 7 available quest types
- Daily reset
- Rewards: Game tokens (Magic)

## Architecture

```
index.js (main bot file)
├── Database Layer (better-sqlite3)
├── Game Logic
│   ├── Character Management
│   ├── Mission System
│   ├── PvP Engine
│   ├── Guild System
│   ├── Marketplace
│   └── Daily Quests
├── Telegram Bot (Telegraf)
└── Command Handlers
    ├── /start, /create
    ├── /stats, /inventory
    ├── /mission, /collect
    ├── /arena, /guild
    └── /market, /daily
```

## Support

For issues or feature requests, check the GitHub repository or contact the development team.
