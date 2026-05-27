'use client';

import { useState } from 'react';

export default function MarketPage() {
  const [sortBy, setSortBy] = useState('price');
  const [filterRarity, setFilterRarity] = useState('all');

  const items = [
    {
      id: 1,
      name: 'Legendary Sword',
      rarity: 'legendary',
      level: 45,
      price: 500000,
      seller: 'ShadowKnight',
      image: '⚔️',
      stat: 'ATK +50',
    },
    {
      id: 2,
      name: 'Ancient Shield',
      rarity: 'epic',
      level: 40,
      price: 250000,
      seller: 'IceWarden',
      image: '🛡️',
      stat: 'DEF +35',
    },
    {
      id: 3,
      name: 'Mystical Staff',
      rarity: 'legendary',
      level: 42,
      price: 450000,
      seller: 'MysticSage',
      image: '🪄',
      stat: 'MAG +45',
    },
    {
      id: 4,
      name: 'Swift Bow',
      rarity: 'epic',
      level: 38,
      price: 180000,
      seller: 'StormBringer',
      image: '🏹',
      stat: 'SPD +40',
    },
    {
      id: 5,
      name: 'Dark Cloak',
      rarity: 'rare',
      level: 35,
      price: 95000,
      seller: 'VoidWalker',
      image: '🧥',
      stat: 'DEF +20',
    },
    {
      id: 6,
      name: 'Healing Potion',
      rarity: 'common',
      level: 1,
      price: 5000,
      seller: 'Merchant',
      image: '🧪',
      stat: 'HP +100',
    },
    {
      id: 7,
      name: 'Phoenix Armor',
      rarity: 'legendary',
      level: 44,
      price: 600000,
      seller: 'PhoenixFlame',
      image: '🔥',
      stat: 'DEF +50, HP +200',
    },
    {
      id: 8,
      name: 'Frost Ring',
      rarity: 'epic',
      level: 36,
      price: 220000,
      seller: 'IceWarden',
      image: '💍',
      stat: 'MAG +25, SPD +15',
    },
  ];

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-500/20 text-gray-300',
    rare: 'bg-blue-500/20 text-blue-300',
    epic: 'bg-purple-500/20 text-purple-300',
    legendary: 'bg-orange-500/20 text-orange-300',
  };

  const filteredItems =
    filterRarity === 'all'
      ? items
      : items.filter((item) => item.rarity === filterRarity);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'level') return b.level - a.level;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Marketplace</h1>
          <p className="text-xl text-gray-400">Buy and sell equipment, potions, and more</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-3">Rarity</h3>
            <div className="flex flex-wrap gap-3">
              {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => setFilterRarity(rarity)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filterRarity === rarity
                      ? 'bg-purple-600 text-white glow'
                      : 'bg-secondary/50 text-gray-300 hover:bg-secondary border border-purple-500/30'
                  }`}
                >
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'price', label: 'Price: Low to High' },
                { key: 'level', label: 'Level: High to Low' },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    sortBy === option.key
                      ? 'bg-purple-600 text-white glow'
                      : 'bg-secondary/50 text-gray-300 hover:bg-secondary border border-purple-500/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-secondary/50 border border-purple-500/30 rounded-lg overflow-hidden card-hover group"
            >
              {/* Item Image */}
              <div className="bg-background/50 p-8 text-center text-6xl group-hover:bg-background transition-colors">
                {item.image}
              </div>

              {/* Item Details */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{item.stat}</p>

                {/* Rarity Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${rarityColors[item.rarity]}`}>
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">Lvl {item.level}</span>
                </div>

                {/* Seller */}
                <p className="text-xs text-gray-500 mb-4">Sold by {item.seller}</p>

                {/* Price and Button */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                  <p className="font-bold text-accent">{item.price.toLocaleString()}</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No items found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
