# ASTRALIS RPG Bot - Deployment Guide

## Quick Start Checklist

- [x] Dependencies installed (`npm install`)
- [ ] BOT_TOKEN obtained from BotFather
- [ ] .env file updated with your token
- [ ] Bot tested locally (`npm start`)
- [ ] Ready to deploy

## Local Testing (Before Deployment)

### 1. Get Your Bot Token

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow prompts and copy the token

### 2. Configure .env

```bash
# Edit .env file
BOT_TOKEN=YOUR_TOKEN_HERE_123456:ABC-DEF...
```

### 3. Start the Bot Locally

```bash
npm start
```

You should see:
```
✅ Bot running...
Database initialized with 8 tables
Listening for Telegram commands
```

### 4. Test Commands

In Telegram:
- Send `/start` to the bot
- Send `/help` to see all commands
- Try `/create warrior` to make a character

## Deploying to Production

### Option 1: Vercel (Recommended)

**Prerequisites:**
- GitHub account
- Vercel account (free tier available)

**Steps:**

1. **Push to GitHub**
```bash
git add .
git commit -m "Setup ASTRALIS RPG Bot"
git push origin main
```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `BOT_TOKEN` = your token from BotFather
   - Save

4. **Deploy**
   - Click "Deploy"
   - Wait for completion
   - Your bot is now running 24/7!

### Option 2: Railway

**Steps:**

1. **Push to GitHub** (same as above)

2. **Connect Railway**
   - Go to railway.app
   - Click "Deploy from GitHub"
   - Select repository
   - Authorize Railway

3. **Add Environment Variable**
   - In Railway, go to Variables
   - Add `BOT_TOKEN` with your token

4. **Deploy**
   - Railway auto-deploys
   - Check "Deployments" tab for status

### Option 3: Heroku (Paid)

**Steps:**

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create App**
```bash
heroku create astralis-rpg-bot
```

4. **Set Environment Variable**
```bash
heroku config:set BOT_TOKEN=your_token
```

5. **Deploy**
```bash
git push heroku main
```

6. **Monitor Logs**
```bash
heroku logs --tail
```

## Monitoring Your Bot

### Check if Bot is Running

**On Vercel/Railway:**
- Check deployment logs in dashboard
- Bot should show as "Deployed" or "Running"

**Telegram Test:**
- Send any message to your bot
- Should respond with main menu

### Logs and Debugging

```bash
# Local logs (during npm start)
# Shows in terminal

# Vercel logs
# Dashboard > Deployments > View Logs

# Railway logs
# Dashboard > Deployments > View Logs
```

### Common Issues

**Bot not responding:**
1. Verify BOT_TOKEN is correct
2. Check logs for errors
3. Make sure bot is running (check deployment status)

**Database errors:**
1. Usually means SQLite file is locked
2. Restart the bot
3. Check if another instance is running

**Timeout errors:**
1. Vercel limits function execution to 10 seconds
2. Consider using serverless functions wrapper
3. Or use Railway for longer-running processes

## Database Persistence

### Vercel
- Database stored in `/tmp` (resets on redeploy)
- Consider adding external PostgreSQL for persistent data
- Or use Vercel KV Store

### Railway
- Database persists across deploys
- Mounted volume automatically included
- Data survives restarts

### Heroku
- Ephemeral filesystem
- Database resets on dyno restart
- Use PostgreSQL add-on for production

## Production Recommendations

1. **Use external database** (PostgreSQL via Railway/Heroku)
2. **Monitor uptime** with monitoring service
3. **Enable error logging** to Sentry/LogRocket
4. **Set up backup** of player data
5. **Use rate limiting** to prevent abuse

## Troubleshooting

### "BOT_TOKEN is required"
```
Solution: Check environment variable is set correctly
- Vercel: Settings > Environment Variables
- Railway: Variables tab
- Heroku: heroku config
```

### "EACCES: permission denied"
```
Solution: Check file permissions
chmod +x index.js
```

### "Port already in use"
```
Solution: Kill process using port
lsof -i :3000  # or your port
kill -9 <PID>
```

### "Database is locked"
```
Solution: Multiple bot instances running
- Kill all instances
- Restart once
- Check deployment settings
```

## Scaling for Production

**If your bot gets popular:**

1. **Use PostgreSQL database** instead of SQLite
2. **Implement caching** with Redis
3. **Load balancing** with multiple instances
4. **Rate limiting** on API endpoints
5. **Monitor performance** with APM tools

## Support & Updates

- Check GitHub Issues
- Review logs regularly
- Update packages monthly
- Test new features in development

---

**Bot successfully deployed!** 🚀

Your game is now accessible 24/7 to Telegram users.
