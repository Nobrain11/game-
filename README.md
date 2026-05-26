# 🌌 ASTRALIS RPG Bot — Phase 1

A full Solana RPG Telegram bot with character classes, missions, item drops, XP leveling, and $MAGIC token burns.

---

## ⚡ Quick Deploy (Railway)

1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variable: `BOT_TOKEN=your_token`
4. Deploy — done

---

## 🛠️ Local Setup

```bash
npm install
cp .env.example .env
# Edit .env and add your BOT_TOKEN
npm start
```

**Node.js 18+ required**

> Note: `canvas` package requires system dependencies. On Railway this is handled automatically. Locally on Ubuntu: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`

---

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/create` | Create your character (choose class) |
| `/profile` | View your character card image |
| `/mission` | Choose and send on a mission |
| `/collect` | Collect mission rewards |
| `/inventory` | View all your items |
| `/equip [name]` | Equip an item |
| `/stats` | Detailed stat breakdown |
| `/top` | Leaderboard |
| `/help` | Command list |

---

## ⚔️ Classes

| Class | Strength | Playstyle |
|-------|----------|-----------|
| ⚔️ Warrior | HP + Attack | Frontline bruiser |
| 🔮 Mage | Magic Power | Burst damage |
| 🏹 Archer | Speed + Crit | Ranged precision |
| 🛡️ Tank | Defense + HP | Damage absorber |
| ✨ Healer | Magic + Support | Divine utility |

---

## 🎯 Mission Difficulties

| Difficulty | Duration | XP | Item Chance |
|------------|----------|----|-------------|
| ⚡ Quick | 15 min | ~30 | Common |
| ⚔️ Normal | 1 hr | ~85 | Uncommon |
| 🔥 Hard | 4 hrs | ~265 | Rare |
| 🌌 Epic | 12 hrs | ~850 | Epic/Legendary |

**Every mission burns `100,000 $MAGIC`** — logged in the `burns` table.

---

## 🪙 Item Rarities

| Rarity | Drop Rate | Emoji |
|--------|-----------|-------|
| Common | 60% | ⚪ |
| Uncommon | 25% | 🟢 |
| Rare | 10% | 🔵 |
| Epic | 4% | 🟣 |
| Legendary | 1% | 🟡 |

---

## 🗄️ Database

SQLite (`astralis.db`) — 4 tables:
- `characters` — all hero data
- `missions` — active + completed missions
- `inventory` — all items per user
- `burns` — token burn log

---

## 🚀 Phase 2 (Coming Next)

- [ ] Raid bosses with live group chat narration
- [ ] Clan system (create, join, clan wars)
- [ ] PvP duels
- [ ] On-chain MAGIC burn verification (Helius)
- [ ] Tournament brackets
- [ ] Boss loot tables (Epic/Legendary only from bosses)
- [ ] Character card PFP export with $MAGIC watermark

---

## 💡 On-Chain Token Burns (Phase 2 Integration)

In `bot.js`, the burn is currently logged to SQLite only.
To verify real on-chain burns before allowing missions:

```js
// In the mission action callback, before starting mission:
const hasBurned = await verifyBurnTransaction(userId, MAGIC_BURN_AMOUNT);
if (!hasBurned) return ctx.reply('Send 100,000 $MAGIC to burn address first!');
```

Connect via Helius API or your preferred Solana RPC.

---

*$MAGIC · ASTRALIS — The realm of eternal glory*
