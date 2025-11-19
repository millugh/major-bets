'use client';

import { useEffect, useState } from 'react';
import type { ParlayDTO } from '@/lib/types';
import type { OddsEvent } from '@/lib/odds';

export function LiveTicker({ parlays }: { parlays: ParlayDTO[] }) {
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
        console.warn('Ticker odds failed', error);
      }
    };
    load();
    const interval = setInterval(load, 1000 * 60 * 3);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const tickerItems = [
    ...parlays.map((p) => `${p.title} · ${p.legs.length} legs · ${p.odds}`),
    ...events.map((event) => `[${event.sport}] ${event.matchup} ${event.spread || event.moneyline || ''} ${event.total || ''}`),
  ];

  if (!tickerItems.length) {
    tickerItems.push('Major is loading today’s board. Tap back soon.');
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <div className="flex animate-ticker gap-8 whitespace-nowrap px-4 py-3 text-sm">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <span key={`${item}-${index}`} className="text-white/70">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
