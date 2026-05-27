export default function StatsOverview() {
  const stats = [
    {
      label: 'Total Players',
      value: '2,847',
      change: '+12.5%',
      icon: '👥',
    },
    {
      label: 'Active Sessions',
      value: '432',
      change: '+5.2%',
      icon: '⚡',
    },
    {
      label: 'Tokens Burned',
      value: '1.2M',
      change: '+23.8%',
      icon: '🔥',
    },
    {
      label: 'Guilds Active',
      value: '156',
      change: '+8.1%',
      icon: '🏰',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card-hover bg-secondary/50 border border-purple-500/30 rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
          <p className="text-success text-sm font-semibold">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}
