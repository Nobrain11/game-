'use client';

export default function BurnReport() {
  const burnStats = {
    today: {
      total: '245,000',
      average: '2,150',
      topBurner: 'ShadowKnight',
      topBurnerAmount: '45,000',
    },
    week: {
      total: '1.8M',
      average: '257,143',
    },
    allTime: {
      total: '12.5M',
      average: '1,565,000',
    },
  };

  return (
    <div className="bg-secondary/50 border border-purple-500/30 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Daily Burn Report</h2>

      {/* Today's Report */}
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-lg mb-3 text-red-300">Today</h3>
        <div className="space-y-3">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Burned</p>
            <p className="text-2xl font-bold text-white">{burnStats.today.total}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Average Per Player</p>
            <p className="text-lg font-semibold text-accent">{burnStats.today.average}</p>
          </div>
          <div className="pt-3 border-t border-red-500/20">
            <p className="text-gray-400 text-xs mb-1">Top Burner</p>
            <p className="font-semibold text-white">{burnStats.today.topBurner}</p>
            <p className="text-sm text-red-300">{burnStats.today.topBurnerAmount} tokens</p>
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-lg mb-3 text-purple-300">This Week</h3>
        <div className="space-y-2">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Burned</p>
            <p className="text-xl font-bold text-white">{burnStats.week.total}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Daily Average</p>
            <p className="text-lg font-semibold text-accent">{burnStats.week.average}</p>
          </div>
        </div>
      </div>

      {/* All Time */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3 text-cyan-300">All Time</h3>
        <div className="space-y-2">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Burned</p>
            <p className="text-xl font-bold text-white">{burnStats.allTime.total}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Average Per Day</p>
            <p className="text-lg font-semibold text-accent">{burnStats.allTime.average}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
