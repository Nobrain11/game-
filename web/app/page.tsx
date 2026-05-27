import { Suspense } from 'react';
import StatsOverview from '@/components/StatsOverview';
import RecentActivity from '@/components/RecentActivity';
import BurnReport from '@/components/BurnReport';
import TopPlayers from '@/components/TopPlayers';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-40">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 border border-[#00d9a3]/30 rounded text-[#00d9a3] text-sm font-semibold">
              ASTRALIS RPG BOT
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
              WIN AS <span className="text-[#00d9a3]">ONE.</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
              The House plays games against competitors. Compete head-to-head in skill games. Bigger takes 20%. 20% burned forever.
            </p>
            <div className="flex gap-4 justify-center mb-8">
              <button className="px-6 py-2 bg-[#00d9a3] text-black font-semibold rounded text-sm hover:bg-[#00b388]">
                PLAY NOW
              </button>
              <button className="px-6 py-2 border border-[#00d9a3]/30 text-[#00d9a3] font-semibold rounded text-sm hover:border-[#00d9a3]">
                DOCS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-[#2a2a2a]">
          <span className="text-[#00d9a3] text-xl">🎮</span>
          <h2 className="text-3xl font-bold">PLAY NOW</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['CARD GAMES', 'BET & GO', 'CHESS', 'PVP ARENA'].map((game) => (
            <div key={game} className="card-hover border border-[#2a2a2a] bg-[#121212] p-6 rounded cursor-pointer">
              <div className="mb-4 w-12 h-12 bg-[#00d9a3]/10 rounded flex items-center justify-center">
                <span className="text-[#00d9a3]">⚡</span>
              </div>
              <h3 className="text-white font-bold mb-2">{game}</h3>
              <p className="text-gray-500 text-sm">Bigger takes 50%. 20% burned and earn 50 every 10 minutes.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <Suspense fallback={<div className="text-center text-gray-400">Loading statistics...</div>}>
          <StatsOverview />
        </Suspense>
      </section>

      {/* Main Content Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<div className="text-center text-gray-400">Loading top players...</div>}>
              <TopPlayers />
            </Suspense>
            <Suspense fallback={<div className="text-center text-gray-400">Loading recent activity...</div>}>
              <RecentActivity />
            </Suspense>
          </div>

          {/* Right Column */}
          <div>
            <Suspense fallback={<div className="text-center text-gray-400">Loading burn report...</div>}>
              <BurnReport />
            </Suspense>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the ASTRALIS Community</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect with thousands of players. Build your character. Compete. Burn tokens. Win rewards.
          </p>
          <a
            href="https://t.me/astralis_rpg_bot"
            className="inline-block bg-[#00d9a3] text-black font-bold py-3 px-8 rounded hover:bg-[#00b388] transition-all"
          >
            Play on Telegram
          </a>
        </div>
      </section>
    </div>
  );
}
