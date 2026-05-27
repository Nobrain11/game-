'use client';

import { useState } from 'react';

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('level');

  const players = [
    { rank: 1, username: 'ShadowKnight', level: 45, xp: 125000, pvpWins: 87, burns: 450000 },
    { rank: 2, username: 'MysticSage', level: 43, xp: 118500, pvpWins: 72, burns: 380000 },
    { rank: 3, username: 'StormBringer', level: 42, xp: 112300, pvpWins: 65, burns: 320000 },
    { rank: 4, username: 'IceWarden', level: 41, xp: 105600, pvpWins: 58, burns: 290000 },
    { rank: 5, username: 'VoidWalker', level: 40, xp: 98200, pvpWins: 51, burns: 250000 },
    { rank: 6, username: 'PhoenixFlame', level: 39, xp: 91500, pvpWins: 44, burns: 210000 },
    { rank: 7, username: 'NovaStrike', level: 38, xp: 84200, pvpWins: 39, burns: 180000 },
    { rank: 8, username: 'EchoHunter', level: 37, xp: 76800, pvpWins: 34, burns: 150000 },
    { rank: 9, username: 'SilentBlade', level: 36, xp: 69400, pvpWins: 29, burns: 120000 },
    { rank: 10, username: 'DarkRaven', level: 35, xp: 62000, pvpWins: 24, burns: 95000 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Leaderboard</h1>
          <p className="text-xl text-gray-400">Compete with thousands of players worldwide</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {['level', 'xp', 'pvp', 'burns'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === option
                  ? 'bg-purple-600 text-white glow'
                  : 'bg-secondary/50 text-gray-300 hover:bg-secondary border border-purple-500/30'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-secondary/50 border border-purple-500/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background/50 border-b border-purple-500/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 hidden sm:table-cell">
                    {filter === 'level' && 'Level'}
                    {filter === 'xp' && 'XP'}
                    {filter === 'pvp' && 'PvP Wins'}
                    {filter === 'burns' && 'Tokens Burned'}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                    {filter === 'level' && 'XP'}
                    {filter === 'xp' && 'Level'}
                    {filter === 'pvp' && 'Level'}
                    {filter === 'burns' && 'Level'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/20">
                {players.map((player) => (
                  <tr
                    key={player.rank}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-accent">#{player.rank}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{player.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 hidden sm:table-cell">
                      {filter === 'level' && player.level}
                      {filter === 'xp' && `${player.xp.toLocaleString()} XP`}
                      {filter === 'pvp' && player.pvpWins}
                      {filter === 'burns' && `${player.burns.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">
                      Level {player.level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Your Rank Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Your Rank</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Rank</p>
              <p className="text-2xl font-bold text-accent">#1,234</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Level</p>
              <p className="text-2xl font-bold text-white">25</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">XP</p>
              <p className="text-2xl font-bold text-white">45,230</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">PvP Wins</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
