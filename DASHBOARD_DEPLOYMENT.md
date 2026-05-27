# ASTRALIS RPG - Dashboard & Notifications Deployment Guide

Complete guide for deploying the web dashboard and notification system for ASTRALIS RPG.

## What's New

This deployment includes:

1. **Web Dashboard** - Beautiful Next.js application with 4 pages
2. **Notification System** - Real-time activity notifications
3. **Daily Burn Reports** - Automated reports 3x daily
4. **API Routes** - Data endpoints for the dashboard
5. **Scheduler** - Cron job system for automated tasks

## Project Structure

```
/vercel/share/v0-project/
├── index.js                        # Main bot (existing)
├── notifications.js                # Notification manager (NEW)
├── scheduler.js                    # Cron scheduler (NEW)
├── bot-notifications.js            # Bot integration (NEW)
├── .env                            # Environment config
├── package.json                    # Dependencies
├── NOTIFICATIONS_SETUP.md          # Notification docs (NEW)
├── DASHBOARD_DEPLOYMENT.md         # This file (NEW)
└── web/                            # Web dashboard (NEW)
    ├── app/
    │   ├── api/                    # API routes
    │   ├── leaderboard/
    │   ├── activity/
    │   ├── market/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/                 # React components
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    └── README.md
```

## Installation Steps

### Step 1: Update Dependencies

```bash
# In root directory
npm install node-cron

# In web directory
cd web
npm install
cd ..
```

### Step 2: Update Environment Variables

Edit `.env`:

```env
# Existing
BOT_TOKEN=your_telegram_bot_token

# New - for notifications
NOTIFICATION_CHANNEL_ID=-1001234567890  # Your Telegram group/channel ID
```

To get your channel ID:
1. Open Telegram
2. Create a group or use existing group
3. Add @userinfobot to the group
4. It will display your group's ID (negative number)

### Step 3: Test Locally

```bash
# Terminal 1: Bot
node index.js

# Terminal 2: Dashboard
cd web && npm run dev
```

Access dashboard at `http://localhost:3000`

### Step 4: Integrate Notification Calls

Edit `index.js` and add to imports (after line 4):

```javascript
const {
  onNewPlayer,
  onLevelUp,
  onPvPBattle,
  onTokenBurn,
  onMarketplaceActivity,
  onGuildEvent,
  onMissionCompletion,
} = require('./bot-notifications');
```

Now, in your existing command handlers, call notification functions:

**Example in /create command:**
```javascript
// After character is created
onNewPlayer(ctx.from.id, username, selectedClass);
```

**Example in /arena or PvP handler:**
```javascript
// After battle resolves
onPvPBattle(winnerId, winnerName, loserId, loserName, magicTokensWon);
```

**Example in /mission handler:**
```javascript
// After mission completion
onMissionCompletion(userId, username, difficulty, rewardAmount);
```

See `NOTIFICATIONS_SETUP.md` for complete integration examples.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel automatically detects and deploys both the bot and Next.js app.

#### A. Deploy Bot (Root Directory)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy root directory
vercel --prod

# 3. When prompted, keep these settings:
# - Project name: astralis-rpg-bot
# - Framework: Other
# - Root directory: ./
# - Build command: (leave empty)
# - Install command: npm install

# 4. Set environment variables in Vercel dashboard:
# Settings > Environment Variables
# - BOT_TOKEN = your_token
# - NOTIFICATION_CHANNEL_ID = your_channel_id
```

#### B. Deploy Dashboard (Web Directory)

```bash
# 1. In web directory
cd web

# 2. Deploy
vercel --prod

# 3. When prompted:
# - Project name: astralis-rpg-dashboard
# - Framework: Next.js
# - Root directory: ./
# - Build command: npm run build
# - Install command: npm install

# 4. No special env vars needed for dashboard
```

Both will be live on separate Vercel domains.

### Option 2: Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Create new project
railway init

# 3. Deploy bot
railway up

# 4. Set env variables
railway env BOT_TOKEN your_token
railway env NOTIFICATION_CHANNEL_ID your_channel_id

# 5. Deploy dashboard (separate project)
cd web
railway init
railway up
```

### Option 3: Heroku

```bash
# 1. Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# 2. Create apps
heroku create astralis-rpg-bot
heroku create astralis-rpg-dashboard

# 3. Deploy bot (root)
git push heroku main

# 4. Set config vars
heroku config:set BOT_TOKEN=your_token
heroku config:set NOTIFICATION_CHANNEL_ID=your_channel_id

# 5. Deploy dashboard
cd web
heroku git:remote -a astralis-rpg-dashboard
git subtree push --prefix web heroku main
```

### Option 4: Self-Hosted (VPS/Linux Server)

```bash
# 1. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone repository
git clone your_repo
cd your_repo

# 3. Install dependencies
npm install
cd web && npm install && cd ..

# 4. Build dashboard
cd web && npm run build && cd ..

# 5. Set up environment
cp .env.example .env
# Edit .env with your values

# 6. Install PM2 (process manager)
npm install -g pm2

# 7. Start services
pm2 start "node index.js" --name "astralis-bot"
pm2 start "npm --prefix web start" --name "astralis-dashboard"
pm2 save
pm2 startup

# 8. Set up reverse proxy (nginx)
# Configure nginx to point to localhost:3000
```

## Verification Checklist

After deployment, verify everything works:

- [ ] Bot is running and responds to `/start`
- [ ] Notifications are being logged
- [ ] Dashboard is accessible
- [ ] API routes return data (`/api/stats`)
- [ ] All 4 dashboard pages load
- [ ] Daily burn reports send at scheduled times
- [ ] `/subscribe` and `/unsubscribe` commands work
- [ ] `/burnreport` command shows stats

## Monitoring

### Check Bot Logs (Vercel)

```bash
vercel logs astralis-rpg-bot --tail
```

### Check Dashboard Logs (Vercel)

```bash
vercel logs astralis-rpg-dashboard --tail
```

### Check Scheduled Tasks

Add this to your bot command handlers to check scheduler status:

```javascript
bot.command('status', (ctx) => {
  const status = scheduler.getStatus();
  ctx.reply(`Scheduler: ${status.totalJobs} jobs active`);
});
```

### View Notifications Database

```bash
# Connect to astralis.db
sqlite3 astralis.db

# View recent notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;

# View daily burns
SELECT * FROM daily_burns ORDER BY report_date DESC LIMIT 7;
```

## Troubleshooting

### Bot not sending notifications

1. Check `BOT_TOKEN` is correct
2. Verify `NOTIFICATION_CHANNEL_ID` is valid
3. Bot must be a member of the channel
4. Check logs: `vercel logs astralis-rpg-bot --tail`

### Dashboard not loading

1. Verify Node.js version is 18+
2. Check API routes: `https://your-dashboard.vercel.app/api/stats`
3. Look for CORS errors in browser console
4. Check build succeeded: `vercel logs astralis-rpg-dashboard`

### Burn reports not sending

1. Check scheduler is running
2. Verify cron expressions in `scheduler.js`
3. Confirm `NOTIFICATION_CHANNEL_ID` is set
4. Check timezone (all times in UTC)

### Database locked errors

1. Ensure only one bot instance is running
2. Check for file locks on `astralis.db`
3. Restart the service

## Customization

### Change Burn Report Times

Edit `scheduler.js`:

```javascript
// Current
this.scheduleBurnReport('0 8 * * *', 'Morning');   // 8:00 AM UTC
this.scheduleBurnReport('0 12 * * *', 'Noon');     // 12:00 PM UTC
this.scheduleBurnReport('0 20 * * *', 'Evening');  // 8:00 PM UTC

// New example (6 AM, 2 PM, 10 PM UTC)
this.scheduleBurnReport('0 6 * * *', 'Morning');
this.scheduleBurnReport('0 14 * * *', 'Afternoon');
this.scheduleBurnReport('0 22 * * *', 'Night');
```

Cron format: `minute hour day month dayOfWeek`

### Change Dashboard Colors

Edit `web/tailwind.config.js`:

```javascript
colors: {
  background: '#0a0e27',  // Change background
  primary: '#7c3aed',     // Change primary color
  accent: '#06b6d4',      // Change accent color
}
```

### Customize API Responses

API routes in `web/app/api/` are using mock data. To connect to real data:

```typescript
// Example: web/app/api/notifications/route.ts
import Database from 'better-sqlite3';

const db = new Database('../astralis.db');
const notifications = db.prepare(
  'SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?'
).all(limit);
```

## Performance Tips

1. **Caching**: Add Redis for frequent queries
2. **CDN**: Use Vercel's automatic edge network
3. **Database**: Consider pagination for large datasets
4. **Images**: Optimize with Next.js Image component
5. **API**: Implement rate limiting on API routes

## Security

1. Always keep `BOT_TOKEN` secret (use env vars only)
2. Validate all user inputs
3. Implement rate limiting
4. Use HTTPS (automatic with Vercel)
5. Keep dependencies updated

## Scaling

As your game grows:

1. **Database**: Upgrade to PostgreSQL
2. **Cache**: Implement Redis
3. **Notifications**: Use message queue (Kafka/RabbitMQ)
4. **API**: Add authentication tokens
5. **Dashboard**: Implement real-time WebSockets

## Support & Documentation

- Bot notifications: See `NOTIFICATIONS_SETUP.md`
- Dashboard development: See `web/README.md`
- Next.js docs: [nextjs.org](https://nextjs.org)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)

## Next Steps

1. Deploy both bot and dashboard
2. Configure notification channel
3. Integrate notification calls into bot commands
4. Test all notification types
5. Monitor burn reports
6. Gather user feedback
7. Iterate and improve

---

**Deployment Guide v1.0**  
**Updated:** May 27, 2024  
**Support:** Check documentation files or review logs
