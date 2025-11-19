'use client';

import type { ParlayDTO } from '@/lib/types';
import { useState } from 'react';
import { format } from 'date-fns';

export function AdminParlayList({ initialParlays, range = 'today' }: { initialParlays: ParlayDTO[]; range?: 'today' | 'history' }) {
  const [parlays, setParlays] = useState(initialParlays);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const refresh = async () => {
    const query = range === 'history' ? '?range=history' : '';
    const res = await fetch(`/api/parlays${query}`);
    if (!res.ok) return;
    const data = await res.json();
    setParlays(data);
  };

  const updateParlay = async (id: string, payload: Partial<ParlayDTO>) => {
    setLoadingId(id);
    const existing = parlays.find((p) => p.id === id);
    if (!existing) return;
    try {
      const res = await fetch(`/api/parlays/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...existing,
          ...payload,
          legs: existing.legs.map((leg, index) => ({ ...leg, order: index })),
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      await refresh();
    } catch (error) {
      console.error(error);
      alert('Update failed');
    } finally {
      setLoadingId(null);
    }
  };

  const deleteParlay = async (id: string) => {
    if (!confirm('Delete this parlay?')) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/parlays/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await refresh();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {parlays.map((parlay) => (
        <article key={parlay.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold">{parlay.title}</h4>
              <p className="text-xs text-white/60">{format(new Date(parlay.dateFor), 'PPPP')}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <select
                value={parlay.status}
                onChange={(event) => updateParlay(parlay.id, { status: event.target.value as ParlayDTO['status'] })}
                className="rounded-full border border-white/20 bg-black/40 px-3 py-1"
                disabled={loadingId === parlay.id}
              >
                <option value="PENDING">Pending</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
                <option value="PUSH">Push</option>
              </select>
              <button
                type="button"
                onClick={() => updateParlay(parlay.id, { isSpotlight: true })}
                className="rounded-full border border-neon-teal px-3 py-1 text-neon-teal"
                disabled={loadingId === parlay.id}
              >
                Set spotlight
              </button>
              <button
                type="button"
                onClick={() => deleteParlay(parlay.id)}
                className="rounded-full border border-red-400 px-3 py-1 text-red-300"
                disabled={loadingId === parlay.id}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
