import { NextResponse } from 'next/server';

// Mock database - In production, this would connect to the actual SQLite database
const mockNotifications = [
  {
    id: 1,
    type: 'new_player',
    username: 'NewAdventurer',
    action: 'joined ASTRALIS',
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 2,
    type: 'level_up',
    username: 'ShadowKnight',
    action: 'reached Level 45',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 3,
    type: 'pvp_win',
    username: 'MysticSage',
    action: 'defeated StormBringer in PvP',
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 4,
    type: 'burn',
    username: 'IceWarden',
    action: 'burned 50,000 tokens',
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 5,
    type: 'marketplace',
    username: 'VoidWalker',
    action: 'listed Legendary Sword',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const type = searchParams.get('type');

  try {
    let results = mockNotifications;

    if (type && type !== 'all') {
      results = results.filter((n) => n.type === type);
    }

    const notifications = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
