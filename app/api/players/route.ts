import { NextResponse } from 'next/server';

// Mock player data
const mockPlayers = [
  {
    rank: 1,
    userId: 123001,
    username: 'ShadowKnight',
    level: 45,
    xp: 125000,
    class: 'Warrior',
    guild: 'Phoenix Rising',
    pvpWins: 87,
    pvpLosses: 12,
    createdAt: '2024-01-15',
  },
  {
    rank: 2,
    userId: 123002,
    username: 'MysticSage',
    level: 43,
    xp: 118500,
    class: 'Mage',
    guild: 'Arcane Circle',
    pvpWins: 72,
    pvpLosses: 18,
    createdAt: '2024-01-20',
  },
  {
    rank: 3,
    userId: 123003,
    username: 'StormBringer',
    level: 42,
    xp: 112300,
    class: 'Ranger',
    guild: 'Thunder Valley',
    pvpWins: 65,
    pvpLosses: 22,
    createdAt: '2024-01-25',
  },
  {
    rank: 4,
    userId: 123004,
    username: 'IceWarden',
    level: 41,
    xp: 105600,
    class: 'Paladin',
    guild: 'Frozen Keep',
    pvpWins: 58,
    pvpLosses: 28,
    createdAt: '2024-02-01',
  },
  {
    rank: 5,
    userId: 123005,
    username: 'VoidWalker',
    level: 40,
    xp: 98200,
    class: 'Rogue',
    guild: 'Shadow Guild',
    pvpWins: 51,
    pvpLosses: 32,
    createdAt: '2024-02-05',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sort') || 'level';
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    let players = [...mockPlayers];

    // Sort players
    switch (sortBy) {
      case 'xp':
        players.sort((a, b) => b.xp - a.xp);
        break;
      case 'pvp':
        players.sort((a, b) => b.pvpWins - a.pvpWins);
        break;
      case 'level':
      default:
        players.sort((a, b) => b.level - a.level);
    }

    // Apply limit
    players = players.slice(0, limit);

    return NextResponse.json({
      success: true,
      sortBy,
      count: players.length,
      data: players,
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}
