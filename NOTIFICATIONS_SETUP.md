# ASTRALIS RPG - Notifications & Dashboard Setup Guide

## Overview

This guide explains how to set up and use the comprehensive notification system and web dashboard for ASTRALIS RPG. The system includes:

- Real-time activity notifications sent to players
- Three daily automated burn reports (8 AM, 12 PM, 8 PM UTC)
- Beautiful web dashboard with player leaderboards, activity feeds, and burn statistics
- API routes for fetching game data
- Automatic logging of all game events

## Architecture

### Components

1. **Notification Manager** (`notifications.js`)
   - Manages all notification types
   - Logs events to database
   - Broadcasts announcements to subscribers

2. **Game Scheduler** (`scheduler.js`)
   - Schedules daily burn reports using cron jobs
   - Runs at 8:00 AM, 12:00 PM, and 8:00 PM UTC
   - Formats and sends reports to channel

3. **Bot Integration** (`bot-notifications.js`)
   - Integrates notification system with Telegraf bot
   - Provides commands: `/subscribe`, `/unsubscribe`, `/burnreport`
   - Exports functions to call in main bot

4. **Web Dashboard** (`web/`)
   - Next.js application with 4 pages
   - Real-time statistics and leaderboards
   - Activity feed and marketplace
   - Beautiful dark theme design

5. **API Routes** (`web/app/api/`)
   - `/api/notifications` - Get recent activity
   - `/api/burns` - Get burn statistics
   - `/api/players` - Get player leaderboards
   - `/api/stats` - Get game statistics

## Installation

### Step 1: Install Dependencies

```bash
# Root directory (Telegram bot)
npm install node-cron

# Web dashboard
cd web
npm install
```

### Step 2: Update .env File

Add the following environment variables to `.env`:

```env
BOT_TOKEN=your_telegram_bot_token
NOTIFICATION_CHANNEL_ID=-1001234567890  # Your channel/group ID for announcements
NODE_ENV=production
```

### Step 3: Integrate with Main Bot

Edit `index.js` and add at the top (after imports):

```javascript
const {
  onNewPlayer,
  onLevelUp,
  onPvPBattle,
  onTokenBurn,
  onMarketplaceActivity,
  onGuildEvent,
  onMissionCompletion,
  sendBurnReport,
} = require('./bot-notifications');
```

Then, call these functions when game events occur in your existing command handlers.

## Usage Examples

### Example 1: Log New Player

When `/create` command is used:

```javascript
const userId = ctx.from.id;
const username = ctx.from.username || ctx.from.first_name;
const playerClass = 'Warrior'; // Selected class

onNewPlayer(userId, username, playerClass);
```

### Example 2: Log Level Up

When a player levels up:

```javascript
onLevelUp(userId, username, newLevel);
```

### Example 3: Log PvP Battle

After a PvP battle:

```javascript
const winnerId = winner.user_id;
const winnerName = winner.username;
const loserId = loser.user_id;
const loserName = loser.username;
const magicWon = 5000;

onPvPBattle(winnerId, winnerName, loserId, loserName, magicWon);
```

### Example 4: Log Token Burn

When tokens are burned:

```javascript
onTokenBurn(userId, username, burntAmount, missionId);
```

## Dashboard Pages

### 1. Home (`/`)
- Statistics overview
- Top 5 players
- Recent activity feed
- Daily burn report
- Call-to-action to play

### 2. Leaderboard (`/leaderboard`)
- Filterable by Level, XP, PvP Wins, or Tokens Burned
- Top 10 global players
- Your personal rank section
- Real-time sorting

### 3. Activity Feed (`/activity`)
- All recent game events
- Filter by event type (New Players, Level Ups, PvP, Burns, Marketplace, etc.)
- Real-time updates
- Load more functionality

### 4. Marketplace (`/market`)
- Browse items for sale
- Filter by rarity (Common, Rare, Epic, Legendary)
- Sort by price or level
- Item details and seller information

## Daily Burn Reports

The scheduler automatically sends burn reports at:
- **08:00 UTC** - Morning Report
- **12:00 UTC** - Noon Report
- **20:00 UTC** - Evening Report

Each report includes:
- Total tokens burned today
- Number of players burning
- Average burn per player
- Top 5 burners with amounts
- Weekly total
- All-time statistics

Format example:
```
🔥 MORNING BURN REPORT 🔥

📊 Today's Statistics:
• Total Burned: 245,000 tokens
• Players Burning: 114
• Average per Player: 2,150 tokens

📈 Weekly Total: 1,800,000 tokens

💰 All Time Total: 12,500,000 tokens

🏆 Top Burners Today:
🥇 #1: ShadowKnight - 45,000 tokens
🥈 #2: MysticSage - 38,000 tokens
🥉 #3: StormBringer - 32,000 tokens
```

## API Routes Reference

### GET /api/notifications
Fetch recent activity notifications

**Query Parameters:**
- `limit` (default: 20) - Number of notifications
- `type` (default: all) - Filter by type: new_player, level_up, pvp_win, burn, marketplace, guild_event

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "new_player",
      "username": "NewAdventurer",
      "action": "joined ASTRALIS",
      "created_at": "2024-05-27T10:30:00Z"
    }
  ],
  "count": 20
}
```

### GET /api/burns
Fetch burn statistics

**Query Parameters:**
- `period` (default: today) - today, week, alltime, topburners

**Response:**
```json
{
  "success": true,
  "period": "today",
  "data": {
    "total": 245000,
    "average": 2150,
    "playerCount": 114
  }
}
```

### GET /api/players
Fetch player leaderboard

**Query Parameters:**
- `sort` (default: level) - level, xp, pvp
- `limit` (default: 10) - Number of players

**Response:**
```json
{
  "success": true,
  "sortBy": "level",
  "count": 10,
  "data": [
    {
      "rank": 1,
      "username": "ShadowKnight",
      "level": 45,
      "xp": 125000
    }
  ]
}
```

### GET /api/stats
Fetch game statistics

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-05-27T10:30:00Z",
  "data": {
    "totalPlayers": 2847,
    "activeSessions": 432,
    "totalTokensBurned": 1200000,
    "guildsActive": 156
  }
}
```

## Bot Commands

### /subscribe
Subscribe to real-time game notifications

**Response:** Confirmation message

### /unsubscribe
Unsubscribe from notifications

**Response:** Confirmation message

### /burnreport
Get the latest burn report

**Response:** Formatted burn statistics

## Running the System

### Development

```bash
# Terminal 1: Bot with notifications
node index.js

# Terminal 2: Web dashboard
cd web && npm run dev
```

### Production (Vercel)

1. Push both directories to GitHub:
   - Root directory for bot (uses `/` root)
   - `web/` directory will auto-detect as separate Next.js app

2. Deploy bot:
   - Connect root repo to Vercel
   - Add `BOT_TOKEN` and `NOTIFICATION_CHANNEL_ID` env vars
   - Set start script to `node index.js`

3. Deploy dashboard:
   - Connect `web/` directory as separate Vercel project
   - Set root directory to `web`
   - Next.js will auto-configure

## Monitoring

### Check Scheduler Status
```javascript
const status = scheduler.getStatus();
console.log(status);
// Output: { totalJobs: 4, jobs: [...] }
```

### View Recent Notifications
```javascript
const notifications = getRecentNotifications(50);
console.log(notifications);
```

### Get Burn Statistics
```javascript
const stats = getDailyBurnStats();
console.log(stats);
// Output: { total_burned: 245000, player_count: 114 }
```

## Customization

### Change Burn Report Times
Edit `scheduler.js` cron expressions:

```javascript
// Current (8 AM, 12 PM, 8 PM UTC)
this.scheduleBurnReport('0 8 * * *', 'Morning');   // 8:00 AM
this.scheduleBurnReport('0 12 * * *', 'Noon');     // 12:00 PM
this.scheduleBurnReport('0 20 * * *', 'Evening');  // 8:00 PM
```

Cron format: `minute hour day month dayOfWeek`

### Change Notification Channel
Edit `.env`:

```env
NOTIFICATION_CHANNEL_ID=-1001234567890  # Your group/channel ID
```

### Customize Dashboard Theme
Edit `web/tailwind.config.js`:

```javascript
colors: {
  background: '#0a0e27',  // Dark background
  primary: '#7c3aed',     // Purple accent
  accent: '#06b6d4',      // Cyan accent
  // ... customize more colors
}
```

## Troubleshooting

### Notifications Not Sending
1. Verify `BOT_TOKEN` is correct
2. Check that users have `/subscribe` command used
3. Review bot logs for errors

### Burn Report Not Appearing
1. Verify `NOTIFICATION_CHANNEL_ID` is valid
2. Check bot is a member of the channel
3. Verify cron time matches your timezone

### Dashboard Not Loading
1. Check Next.js dev server is running
2. Verify API routes are accessible: `localhost:3000/api/stats`
3. Check browser console for errors

## Support

For issues or questions:
1. Check the logs in console
2. Review the API responses in browser DevTools
3. Verify all environment variables are set
4. Ensure databases are initialized properly

## Next Steps

1. Integrate notification calls into main `index.js` command handlers
2. Deploy both bot and dashboard to production
3. Configure notification channel and subscribe users
4. Monitor burn reports and activity feed
5. Customize dashboard as needed

---

**Version:** 1.0.0  
**Last Updated:** May 27, 2024
