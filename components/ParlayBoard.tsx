import type { ParlayDTO } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';

const badgeClasses: Record<string, string> = {
  WON: 'bg-green-500/20 text-green-300',
  LOST: 'bg-red-500/20 text-red-300',
  PENDING: 'bg-yellow-500/20 text-yellow-200',
  PUSH: 'bg-white/10 text-white/70',
};

export function ParlayBoard({ title, parlays }: { title: string; parlays: ParlayDTO[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-surface-800/80 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">{title}</p>
          <h3 className="font-display text-2xl">Daily Card</h3>
        </div>
        <Link href="#history" className="text-sm text-neon-teal hover:underline">
          View history
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {parlays.length === 0 && <p className="text-white/60">No parlays posted yet.</p>}
        {parlays.map((parlay) => (
          <article key={parlay.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-surface-700/80 to-surface-900/80 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">{parlay.title}</h4>
                <p className="text-xs text-white/50">{format(new Date(parlay.dateFor), 'PPP')}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[parlay.status]}`}>{parlay.status}</span>
            </div>
            <p className="text-sm text-white/70">Odds {parlay.odds} • Confidence {parlay.confidence}/10</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-white/50">Risk</p>
                <p className="font-semibold">${parlay.risk.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/50">To Win</p>
                <p className="font-semibold">${parlay.toWin.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/50">Legs</p>
                <p className="font-semibold">{parlay.legs.length}</p>
              </div>
            </div>
            <ul className="grid gap-2 text-xs text-white/70">
              {parlay.legs.slice(0, 4).map((leg) => (
                <li key={leg.id} className="rounded-xl bg-white/5 px-3 py-2">
                  {leg.league} · {leg.market} {leg.line} ({leg.legOdds})
                </li>
              ))}
              {parlay.legs.length > 4 && <li className="text-white/60">+{parlay.legs.length - 4} more legs</li>}
            </ul>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${parlay.title} ${parlay.odds} - tap in https://major-bets.netlify.app`)}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neon-teal hover:underline"
            >
              Share this parlay
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
