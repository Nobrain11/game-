# ASTRALIS RPG - Web Dashboard

A beautiful, real-time web dashboard for the ASTRALIS RPG Telegram bot. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- **Real-time Statistics** - Live player counts, active sessions, tokens burned, and more
- **Player Leaderboard** - Sort by level, XP, PvP wins, or tokens burned
- **Activity Feed** - Real-time game events and player actions
- **Marketplace** - Browse and filter items for sale
- **Burn Reports** - Daily statistics with top burners and trends
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Dark Theme** - Eye-friendly purple and cyan color scheme
- **Fast Performance** - Optimized with Next.js 16 features

## Tech Stack

- **Frontend Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Inter from Google Fonts

## Quick Start

### Prerequisites

- Node.js 18+ (for local development)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web/
├── app/
│   ├── api/                    # API routes
│   │   ├── notifications/      # Get activity notifications
│   │   ├── burns/              # Get burn statistics
│   │   ├── players/            # Get player data
│   │   └── stats/              # Get game statistics
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── 
│       ├── leaderboard/        # Leaderboard page
│       ├── activity/           # Activity feed page
│       └── market/             # Marketplace page
├── components/
│   ├── Navigation.tsx          # Navigation bar
│   ├── Footer.tsx              # Footer
│   ├── StatsOverview.tsx       # Stats cards
│   ├── TopPlayers.tsx          # Top 5 players
│   ├── RecentActivity.tsx      # Recent activity feed
│   └── BurnReport.tsx          # Daily burn report
├── public/                     # Static assets
├── lib/                        # Utility functions
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Pages

### Home (`/`)
Dashboard with overview statistics, top players, recent activity, and burn report.

**Components:**
- StatsOverview (4 key metrics)
- TopPlayers (Top 5 players)
- RecentActivity (Latest 6 events)
- BurnReport (Daily statistics)

### Leaderboard (`/leaderboard`)
Sortable global leaderboard with filtering options.

**Features:**
- Sort by Level, XP, PvP Wins, or Tokens Burned
- View top 10 players
- Personal rank section

### Activity (`/activity`)
Real-time game event feed with filtering.

**Features:**
- Filter by event type
- View detailed activity logs
- Timestamps for each event
- Load more functionality

### Marketplace (`/market`)
Item marketplace with browsing and filtering.

**Features:**
- Browse items by rarity
- Sort by price or level
- Item details and seller info
- Buy button (connects to bot)

## API Routes

### GET `/api/stats`
Get game statistics

Response:
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

### GET `/api/players?sort=level&limit=10`
Get player leaderboard

Query params:
- `sort`: level, xp, pvp (default: level)
- `limit`: number of players (default: 10)

### GET `/api/burns?period=today`
Get burn statistics

Query params:
- `period`: today, week, alltime, topburners (default: today)

### GET `/api/notifications?limit=20&type=all`
Get recent notifications

Query params:
- `limit`: number of notifications (default: 20)
- `type`: all, new_player, level_up, pvp_win, burn, marketplace (default: all)

## Customization

### Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      background: '#0a0e27',  // Main bg color
      foreground: '#ffffff',  // Text color
      primary: '#7c3aed',     // Purple accent
      secondary: '#1e1b4b',   // Secondary bg
      accent: '#06b6d4',      // Cyan accent
      success: '#10b981',     // Green
      warning: '#f59e0b',     // Orange
      danger: '#ef4444',      // Red
    },
  },
}
```

### Typography

Fonts are defined in `app/layout.tsx` and configured in `tailwind.config.js`.

Add custom fonts:
```javascript
// app/layout.tsx
import { YourFont } from 'next/font/google';
const font = YourFont({ subsets: ['latin'] });

// tailwind.config.js
fontFamily: {
  sans: ['var(--font-your-font)', 'system-ui', 'sans-serif'],
}
```

### Metadata

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your description',
};
```

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Select the `web` directory as root
5. Deploy

```bash
# Deploy with Vercel CLI
npm i -g vercel
vercel
```

### Other Platforms

This is a standard Next.js 16 application. It can be deployed to:
- Netlify
- Railway
- Render
- AWS
- DigitalOcean
- Any Node.js hosting

## Performance Optimization

- Images are optimized with Next.js Image component
- CSS is minified with Tailwind
- JavaScript is optimized with Next.js build system
- API routes are serverless functions
- Static assets are cached

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Development Tips

### Hot Reload
Changes to files automatically reload the browser

### TypeScript
Get full type safety with TypeScript

### Tailwind CSS
Use utility classes for rapid development:
```tsx
<div className="bg-purple-600 text-white px-4 py-2 rounded-lg">
  Styled with Tailwind
</div>
```

### Components
Reusable components in `components/` directory

### API Routes
Add new API endpoints in `app/api/` directory

## Troubleshooting

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind styles not applying
Make sure `globals.css` includes all three Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit a pull request

## License

Part of ASTRALIS RPG. All rights reserved.

## Support

For issues or questions:
1. Check the [main documentation](../NOTIFICATIONS_SETUP.md)
2. Review API responses in browser DevTools
3. Check Next.js documentation at [nextjs.org](https://nextjs.org)

---

**Built with Next.js 16 and React 19**  
**Last Updated:** May 27, 2024
