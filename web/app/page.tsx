import { Suspense } from 'react';
import StatsOverview from '@/components/StatsOverview';
import RecentActivity from '@/components/RecentActivity';
import BurnReport from '@/components/BurnReport';
import TopPlayers from '@/components/TopPlayers';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-32 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="gradient-text text-5xl sm:text-7xl font-bold tracking-tight mb-4">
              ASTRALIS RPG
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              Real-time Game Dashboard & Analytics
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Track players, monitor burning activity, and explore the ASTRALIS universe in real-time.
              Engage with the community and watch the economy evolve.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <Suspense fallback={<div className="text-center text-gray-400">Loading statistics...</div>}>
          <StatsOverview />
        </Suspense>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
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
        <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join ASTRALIS RPG Today</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your adventure, build your character, and compete with thousands of players worldwide.
          </p>
          <a
            href="https://t.me/astralis_rpg_bot"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg glow transition-all"
          >
            Play Now on Telegram
          </a>
        </div>
      </section>
    </div>
  );
}
