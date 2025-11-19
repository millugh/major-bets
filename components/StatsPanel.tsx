import type { PerformanceSummary } from '@/lib/types';

export function StatsPanel({ summary }: { summary: PerformanceSummary }) {
  const cards = [
    { label: 'Last 30 bets', value: summary.total30 },
    { label: 'Wins', value: summary.wins },
    { label: 'Losses', value: summary.losses },
    { label: 'Pushes', value: summary.pushes },
    { label: 'Win rate', value: `${summary.winRate}%` },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-surface-800/80 p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">Performance</p>
      <h3 className="font-display text-2xl">Last 30-day pulse</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-3xl font-semibold">{card.value}</p>
            <p className="text-sm text-white/60">{card.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
