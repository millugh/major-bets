import type { ParlayDTO } from '@/lib/types';
import { format } from 'date-fns';

const statusColor: Record<string, string> = {
  WON: 'text-green-300',
  LOST: 'text-red-300',
  PENDING: 'text-yellow-200',
  PUSH: 'text-white/60',
};

export function HistoryGrid({ parlays }: { parlays: ParlayDTO[] }) {
  return (
    <section id="history" className="rounded-3xl border border-white/10 bg-surface-800/80 p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">Weekly / History</p>
        <h3 className="font-display text-2xl">Recent Results</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {parlays.map((parlay) => (
          <article key={parlay.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">{format(new Date(parlay.dateFor), 'PP')}</p>
                <h4 className="font-semibold">{parlay.title}</h4>
              </div>
              <span className={`${statusColor[parlay.status]} text-sm font-semibold`}>{parlay.status}</span>
            </div>
            <p className="mt-2 text-sm text-white/60">{parlay.description || parlay.notes || 'Multi-leg build'}.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
