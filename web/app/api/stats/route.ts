import { NextResponse } from 'next/server';

// Mock game statistics
const mockStats = {
  totalPlayers: 2847,
  activeSessions: 432,
  totalTokensBurned: 1200000,
  guildsActive: 156,
  missionsCompleted: 8234,
  pvpBattles: 5621,
  marketplaceListings: 3401,
  averagePlayerLevel: 28,
  growthRate: {
    players: 12.5,
    sessions: 5.2,
    burns: 23.8,
    guilds: 8.1,
  },
  topStatistics: {
    highestLevel: 45,
    highestXP: 125000,
    mostPvPWins: 87,
    largestGuild: {
      name: 'Phoenix Rising',
      members: 234,
    },
  },
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: mockStats,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
