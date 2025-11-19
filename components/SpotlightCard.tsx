import type { ParlayDTO } from '@/lib/types';
import { format } from 'date-fns';

export function SpotlightCard({ parlay }: { parlay: ParlayDTO | null }) {
  if (!parlay) {
    return (
      <section id="spotlight" className="rounded-3xl border border-white/10 bg-surface-800/80 p-8">
        <p className="text-center text-white/60">No spotlight parlay posted yet. Check back soon.</p>
      </section>
    );
  }

  return (
    <section id="spotlight" className="rounded-3xl border border-white/10 bg-surface-800/80 p-8">
      <div className="flex flex-col gap-6">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">Spotlight Parlay</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl">{parlay.title}</h2>
              <p className="text-sm text-white/50">Updated {format(new Date(parlay.updatedAt), 'PPpp')}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-white/50">Risk</p>
                <p className="text-xl font-semibold">${parlay.risk.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-white/50">To win</p>
                <p className="text-xl font-semibold">${parlay.toWin.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-white/50">Confidence</p>
                <p className="text-xl font-semibold">{parlay.confidence}/10</p>
              </div>
            </div>
          </div>
        </header>
        <ul className="grid gap-2 text-sm">
          {parlay.legs.map((leg) => (
            <li key={leg.id} className="flex flex-wrap items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <div>
                <p className="font-semibold">
                  {leg.order + 1}. {leg.eventName}
                </p>
                <p className="text-white/60">{leg.playerName ? `${leg.playerName} · ` : ''}{leg.market} {leg.line}</p>
              </div>
              <div className="text-neon-teal">{leg.legOdds}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
