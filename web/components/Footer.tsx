export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-purple-500/20 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">ASTRALIS</h3>
            <p className="text-gray-400 text-sm">
              A real-time RPG experience on Telegram with on-chain token burning.
            </p>
          </div>

          {/* Game */}
          <div>
            <h4 className="font-bold mb-4">Game</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://t.me/astralis_rpg_bot" className="hover:text-accent">
                  Play Now
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-accent">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Telegram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Github
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-accent">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500/20 pt-8 flex justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 ASTRALIS RPG. All rights reserved.</p>
          <p>Built with love on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
