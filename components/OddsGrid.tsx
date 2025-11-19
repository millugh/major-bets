'use client';

import { useEffect, useState } from 'react';
import type { OddsEvent } from '@/lib/odds';

export function OddsGrid() {
  const [events, setEvents] = useState<OddsEvent[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/odds');
        const data = await res.json();
        if (!active) return;
        setEvents(data.events || []);
      } catch (error) {
        console.warn('odds fetch failed', error);
      }
    };
    load();
    const interval = setInterval(load, 1000 * 60 * 5);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-surface-800/80 p-6">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">Live Numbers</p>
        <h3 className="font-display text-2xl">Odds Pulse</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {!events.length && <p className="text-white/60">Odds feed sleeping. Using cached board soon.</p>}
        {events.map((event, index) => (
          <article key={`${event.matchup}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase text-neon-teal">{event.sport}</p>
            <h4 className="text-lg font-semibold">{event.matchup}</h4>
            <p className="text-sm text-white/60">{event.startTime}</p>
            <div className="mt-3 space-y-1 text-sm text-white/80">
              {event.spread && <p>Spread: {event.spread}</p>}
              {event.moneyline && <p>Moneyline: {event.moneyline}</p>}
              {event.total && <p>Total: {event.total}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
