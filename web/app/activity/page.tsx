'use client';

import { useState } from 'react';

export default function ActivityPage() {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'new_player',
      username: 'NewAdventurer',
      action: 'joined ASTRALIS',
      class: 'Warrior',
      timestamp: '2 minutes ago',
      icon: '✨',
    },
    {
      id: 2,
      type: 'level_up',
      username: 'ShadowKnight',
      action: 'reached Level 45',
      class: 'Warrior',
      timestamp: '5 minutes ago',
      icon: '⬆️',
    },
    {
      id: 3,
      type: 'pvp_win',
      username: 'MysticSage',
      action: 'defeated StormBringer in PvP',
      class: 'Mage',
      timestamp: '8 minutes ago',
      icon: '⚔️',
    },
    {
      id: 4,
      type: 'burn',
      username: 'IceWarden',
      action: 'burned 50,000 tokens',
      class: 'Paladin',
      timestamp: '12 minutes ago',
      icon: '🔥',
    },
    {
      id: 5,
      type: 'marketplace',
      username: 'VoidWalker',
      action: 'listed Legendary Sword for 100,000 SOL',
      class: 'Rogue',
      timestamp: '15 minutes ago',
      icon: '🛒',
    },
    {
      id: 6,
      type: 'guild_event',
      username: 'Phoenix Rising',
      action: 'defeated Raid Boss - Shadowlord',
      class: 'Guild',
      timestamp: '18 minutes ago',
      icon: '👹',
    },
    {
      id: 7,
      type: 'mission_complete',
      username: 'StormBringer',
      action: 'completed Legendary Mission',
      class: 'Ranger',
      timestamp: '22 minutes ago',
      icon: '✓',
    },
    {
      id: 8,
      type: 'equipment',
      username: 'VoidWalker',
      action: 'equipped Ancient Rune Blade',
      class: 'Rogue',
      timestamp: '25 minutes ago',
      icon: '⚔️',
    },
  ];

  const filteredActivities =
    filter === 'all' ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Activity Feed</h1>
          <p className="text-xl text-gray-400">Real-time game events and player actions</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: 'All Events' },
            { key: 'new_player', label: 'New Players' },
            { key: 'level_up', label: 'Level Ups' },
            { key: 'pvp_win', label: 'PvP' },
            { key: 'burn', label: 'Burns' },
            { key: 'marketplace', label: 'Marketplace' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === option.key
                  ? 'bg-purple-600 text-white glow'
                  : 'bg-secondary/50 text-gray-300 hover:bg-secondary border border-purple-500/30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-secondary/50 border border-purple-500/30 rounded-lg p-6 hover:bg-secondary/70 transition-colors card-hover"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{activity.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold text-lg">
                        <span className="text-accent">{activity.username}</span>
                        {' '}
                        <span className="text-gray-300">{activity.action}</span>
                      </p>
                      <p className="text-gray-400 text-sm mt-1">{activity.timestamp}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                      {activity.class}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg glow transition-all">
            Load More Events
          </button>
        </div>
      </div>
    </div>
  );
}
