# ASTRALIS RPG - Complete Game Guide

## Welcome to ASTRALIS!

A fully-featured Solana RPG Telegram bot with character progression, PvP, guilds, and more.

## Getting Started

### 1. Find the Bot

Search for your bot in Telegram and send `/start`

### 2. Create Your Character

Choose from 9 unique classes:

```
/create warrior      ⚔️  High HP & Attack (Tank role)
/create mage         🔮  High Magic & Speed (Burst damage)
/create archer       🏹  Speed & Crit (Ranged DPS)
/create tank         🛡️  Maximum Defense & HP (Protector)
/create healer       ✨  Magic & Support (Utility)
/create draconid     🐉  Highest Attack & HP (Damage dealer)
/create rogue        🌑  Highest Speed & Crit (Assassin)
/create chrono       ⏳  Magic & Speed (Controller)
/create crystalforged 💎  Most Defense (Ultimate tank)
```

Each class has unique stats affecting:
- **HP**: Health points
- **Attack**: Physical damage
- **Defense**: Physical resistance
- **Magic**: Spell power
- **Speed**: Turn order in combat
- **Crit**: Critical hit chance

## Core Game Systems

### Character Progression

**Leveling:**
- Gain XP from missions and PvP
- Level increases all stats
- Maximum level: 50 (future expansions)
- Check `/stats` to view progress

**Equipment:**
- Find items from missions
- 3 categories: Weapon, Armor, Trinket
- 5 rarities: Common → Uncommon → Rare → Epic → Legendary
- Upgrades increase rarity and stat bonuses

**Stat Bonuses:**
```
Common       → +1 to 2 stats
Uncommon     → +2 to 3 stats
Rare         → +3 to 4 stats
Epic         → +4 to 5 stats
Legendary    → +5 to 6 stats
```

### Missions (Primary Income)

**Difficulty Levels:**
```
Quick   ⚡  15 minutes   → XP: 25-35   | Rewards: Low rarity items
Normal  ⚔️  1 hour       → XP: 75-100  | Rewards: Low-Mid rarity items
Hard    🔥  4 hours      → XP: 230-300 | Rewards: Mid-High rarity items
Epic    🌌  12 hours     → XP: 750-950 | Rewards: High-Legendary items
```

**How to Run Missions:**

1. `/mission quick` (or normal/hard/epic)
2. Complete the timer
3. `/collect` to get rewards
4. Items added to inventory

**Strategy:**
- Run missions matching your level
- Epic missions = best rewards but longest wait
- Queue multiple missions while playing

### PvP Arena (Player vs Player)

**How to Battle:**

1. `/arena` → See opponent list
2. Choose opponent
3. Battle system:
   - Both players roll damage
   - Stats determine outcome
   - Winner gets +1 streak
   - Loser gets -1 streak

**Damage Calculation:**
```
Base Damage = Attack * Random(0.8-1.2)
Final Damage = Base - (Enemy Defense * 0.5)
Crit Damage = Base * (1 + Crit%)
Magic Damage = Magic * (1 + Crit%)
```

**Rankings:**
- Tracked by PvP Wins
- Streak = consecutive wins
- Leaderboard (coming soon)

### Guild System (Group Content)

**Creating a Guild:**

1. `/guild` → Create
2. Enter guild name (unique)
3. Become Leader
4. Invite friends

**Guild Features:**
- Shared treasury
- Member permissions
- Raid boss battles
- Guild leveling
- Perks at higher levels

**Raid Bosses:**
```
Void Leviathan    🌊  HP: 5000   | Reward: 500 XP + 500K Magic
Infernal Drake    🔥  HP: 8000   | Reward: 800 XP + 800K Magic
Chrono Lich       💀  HP: 12000  | Reward: 1200 XP + 1.2M Magic
Abyss Colossus    🌑  HP: 20000  | Reward: 2000 XP + 2M Magic
```

**Guild XP:**
- Earned from member activities
- Unlock perks at higher levels
- Perks include: Stat bonuses, better drops, etc.

### Marketplace (Trading)

**Buy Items:**
```
/market → View listings
Select item
Confirm purchase
Item added to inventory
```

**Sell Items:**
```
/inventory → Select item
/sell [item_id] [price]
Item listed for other players
Receive Magic when sold
```

**Pricing Tips:**
- Check current listings first
- Rare items = higher price
- New items = more demand
- Undercut slightly for quick sales

### Daily Quests (Bonus Rewards)

**New Daily Quests Every 24h:**

```
📋 Available Quest Types:
- Complete any mission → 50K Magic
- Complete Hard/Epic mission → 150K Magic
- Win a PvP battle → 100K Magic
- Win 3 PvP battles → 300K Magic
- Upgrade an item → 75K Magic
- List item on market → 50K Magic
- Hit guild raid boss → 200K Magic
```

**How to Complete:**
1. `/daily` → See active quests
2. Complete the task
3. Quest auto-completes
4. Rewards sent automatically

## Command Reference

### Profile Commands
```
/start              - Initialize character
/create [class]     - Create character
/stats              - View stats/progress
/profile            - View full profile
/inventory          - View items
/help               - Show all commands
```

### Adventure Commands
```
/mission [difficulty]  - Start mission (quick/normal/hard/epic)
/collect               - Claim mission rewards
/upgrade [item_id]     - Upgrade item rarity
```

### Combat Commands
```
/arena                 - Enter PvP arena
/battle [opponent_id]  - Challenge opponent
```

### Guild Commands
```
/guild                 - Guild menu
/guild create [name]   - Create guild
/guild invite [user]   - Invite member
/guild raid            - Fight boss
/guild treasury        - View funds
```

### Market Commands
```
/market                - View listings
/buy [item_id]         - Purchase item
/sell [item_id] [price]- List item
```

### Daily Commands
```
/daily                 - View daily quests
```

## Progression Tips

### Early Game (Level 1-10)
1. Create character
2. Run Quick missions to learn system
3. Equip best items
4. Do daily quests
5. Start PvP when comfortable

### Mid Game (Level 10-30)
1. Run Normal/Hard missions
2. Upgrade all items to Uncommon/Rare
3. Join a guild
4. Do PvP regularly
5. Complete all daily quests
6. Use marketplace for better items

### Late Game (Level 30+)
1. Focus on Epic missions
2. Upgrade to Legendary items
3. Dominate PvP leaderboard
4. Lead/manage guild
5. Help new players
6. Plan for new features

## Economy

**Currency: Magic Tokens**

**Income Sources:**
```
Quick Mission      → 100K Magic
Normal Mission     → 100K Magic
Hard Mission       → 100K Magic
Epic Mission       → 100K Magic
Daily Quests       → 50-300K Magic
Item Sales         → Variable
Raid Rewards       → 500K-2M Magic
```

**Spending:**
```
Item Upgrade (Common)        → 50K Magic
Item Upgrade (Uncommon)      → 150K Magic
Item Upgrade (Rare)          → 400K Magic
Item Upgrade (Epic)          → 1M Magic
Item Upgrade (Legendary)     → 5M Magic
```

**Inflation Tips:**
- Grind epic missions efficiently
- Sell unwanted items
- Join active guilds for raid rewards

## FAQ

**Q: How do I reset my character?**
A: Not yet implemented. Choose wisely!

**Q: Can I trade with friends?**
A: Use marketplace for any player

**Q: Is there a level cap?**
A: Level 50 (future expansions planned)

**Q: How often do bosses reset?**
A: Every 24 hours (adjustable by guild)

**Q: Can I have multiple characters?**
A: Only one per Telegram account (for now)

**Q: What's the endgame?**
A: PvP leaderboard, guild wars, events

## Future Features (Roadmap)

### Phase 2
- [ ] Raid Guild Wars
- [ ] Clans (larger guilds)
- [ ] Seasonal leaderboards
- [ ] Limited-time events
- [ ] New classes
- [ ] Max level increase to 100

### Phase 3
- [ ] Player housing
- [ ] Crafting system
- [ ] Pet system
- [ ] Social features
- [ ] Trading system
- [ ] Battle passes

## Support

**Stuck? Try:**
1. `/help` - In-game help
2. Check Game Guide (this file)
3. Ask guild members
4. Report bugs on GitHub

## Credits

**ASTRALIS RPG Bot**
- Developed as a fully-featured Solana RPG experience
- Inspired by classic RPG mechanics
- Built with Telegram Bot API

---

**Ready to begin your adventure in ASTRALIS?**

Join thousands of players and climb the ranks! 🚀
