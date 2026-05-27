'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">ASTRALIS<span className="text-[#00d9a3]">.io</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-400 hover:text-[#00d9a3] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-400 hover:text-[#00d9a3] transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/activity"
              className="text-gray-400 hover:text-[#00d9a3] transition-colors"
            >
              Activity
            </Link>
            <Link
              href="/market"
              className="text-gray-400 hover:text-[#00d9a3] transition-colors"
            >
              Market
            </Link>
            <a
              href="https://t.me/astralis_rpg_bot"
              className="bg-[#00d9a3] hover:bg-[#00b388] text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Play
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-accent"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-purple-500/20">
            <Link
              href="/"
              className="block py-2 text-gray-300 hover:text-accent transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/leaderboard"
              className="block py-2 text-gray-300 hover:text-accent transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/activity"
              className="block py-2 text-gray-300 hover:text-accent transition-colors"
            >
              Activity
            </Link>
            <Link
              href="/market"
              className="block py-2 text-gray-300 hover:text-accent transition-colors"
            >
              Market
            </Link>
            <a
              href="https://t.me/astralis_rpg_bot"
              className="block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors"
            >
              Play Now
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
