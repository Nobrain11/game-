'use client';

export default function RecentActivity() {
  const activities = [
    {
      type: 'level_up',
      username: 'ShadowKnight',
      action: 'reached Level 45',
      timestamp: '2 minutes ago',
      icon: '⬆️',
    },
    {
      type: 'pvp_win',
      username: 'MysticSage',
      action: 'defeated StormBringer in PvP',
      timestamp: '5 minutes ago',
      icon: '⚔️',
    },
    {
      type: 'burn',
      username: 'IceWarden',
      action: 'burned 50,000 tokens',
      timestamp: '8 minutes ago',
      icon: '🔥',
    },
    {
      type: 'marketplace',
      username: 'VoidWalker',
      action: 'listed Legendary Sword',
      timestamp: '12 minutes ago',
      icon: '🛒',
    },
    {
      type: 'guild_event',
      username: 'Phoenix Rising',
      action: 'defeated Raid Boss',
      timestamp: '15 minutes ago',
      icon: '👹',
    },
    {
      type: 'new_player',
      username: 'NewAdventurer',
      action: 'joined ASTRALIS',
      timestamp: '18 minutes ago',
      icon: '✨',
    },
  ];

  return (
    <div className="bg-secondary/50 border border-purple-500/30 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
          >
            <span className="text-2xl">{activity.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-semibold text-accent">{activity.username}</span>
                {' '}
                <span className="text-gray-300">{activity.action}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href="/activity"
          className="text-accent hover:text-cyan-400 font-semibold text-sm transition-colors"
        >
          View All Activity →
        </a>
      </div>
    </div>
  );
}
