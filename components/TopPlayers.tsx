'use client';

export default function TopPlayers() {
  const players = [
    {
      rank: 1,
      username: 'ShadowKnight',
      level: 45,
      xp: 125000,
      class: 'Warrior',
      guild: 'Phoenix Rising',
    },
    {
      rank: 2,
      username: 'MysticSage',
      level: 43,
      xp: 118500,
      class: 'Mage',
      guild: 'Arcane Circle',
    },
    {
      rank: 3,
      username: 'StormBringer',
      level: 42,
      xp: 112300,
      class: 'Ranger',
      guild: 'Thunder Valley',
    },
    {
      rank: 4,
      username: 'IceWarden',
      level: 41,
      xp: 105600,
      class: 'Paladin',
      guild: 'Frozen Keep',
    },
    {
      rank: 5,
      username: 'VoidWalker',
      level: 40,
      xp: 98200,
      class: 'Rogue',
      guild: 'Shadow Guild',
    },
  ];

  const classColors: Record<string, string> = {
    Warrior: 'bg-red-500/20 text-red-300',
    Mage: 'bg-blue-500/20 text-blue-300',
    Ranger: 'bg-green-500/20 text-green-300',
    Paladin: 'bg-yellow-500/20 text-yellow-300',
    Rogue: 'bg-purple-500/20 text-purple-300',
  };

  return (
    <div className="bg-secondary/50 border border-purple-500/30 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Top Players</h2>
      <div className="space-y-4">
        {players.map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600/30 rounded-full font-bold">
                #{player.rank}
              </div>
              <div>
                <p className="font-semibold text-white">{player.username}</p>
                <p className="text-sm text-gray-400">{player.guild}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-accent">Level {player.level}</p>
              <p className="text-xs text-gray-400">{player.xp.toLocaleString()} XP</p>
            </div>
            <div className="hidden md:block">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classColors[player.class]}`}>
                {player.class}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
