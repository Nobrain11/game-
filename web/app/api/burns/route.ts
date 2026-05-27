import { NextResponse } from 'next/server';

// Mock burn data
const mockBurnData = {
  today: {
    total: 245000,
    average: 2150,
    playerCount: 114,
    topBurner: 'ShadowKnight',
    topBurnerAmount: 45000,
  },
  thisWeek: {
    total: 1800000,
    daily: [
      { date: '2024-05-27', amount: 245000 },
      { date: '2024-05-26', amount: 228000 },
      { date: '2024-05-25', amount: 312000 },
      { date: '2024-05-24', amount: 267000 },
      { date: '2024-05-23', amount: 289000 },
      { date: '2024-05-22', amount: 234000 },
      { date: '2024-05-21', amount: 225000 },
    ],
  },
  allTime: {
    total: 12500000,
    average: 1565000,
    totalDays: 8,
  },
  topBurners: [
    { rank: 1, username: 'ShadowKnight', amount: 450000, level: 45 },
    { rank: 2, username: 'MysticSage', amount: 380000, level: 43 },
    { rank: 3, username: 'StormBringer', amount: 320000, level: 42 },
    { rank: 4, username: 'IceWarden', amount: 290000, level: 41 },
    { rank: 5, username: 'VoidWalker', amount: 250000, level: 40 },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'today';

  try {
    let data;

    switch (period) {
      case 'today':
        data = mockBurnData.today;
        break;
      case 'week':
        data = mockBurnData.thisWeek;
        break;
      case 'alltime':
        data = mockBurnData.allTime;
        break;
      case 'topburners':
        data = mockBurnData.topBurners;
        break;
      default:
        data = mockBurnData;
    }

    return NextResponse.json({
      success: true,
      period,
      data,
    });
  } catch (error) {
    console.error('Error fetching burn data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch burn data' },
      { status: 500 }
    );
  }
}
