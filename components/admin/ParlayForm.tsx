'use client';

import { useState } from 'react';
import type { ParlayDTO } from '@/lib/types';

const emptyLeg = {
  league: '',
  eventName: '',
  playerName: '',
  market: '',
  line: '',
  legOdds: '',
  note: '',
  result: 'PENDING' as const,
};

export function ParlayForm({ existing }: { existing?: ParlayDTO | null }) {
  const existingLegs =
    existing?.legs.map((leg, index) => ({
      league: leg.league,
      eventName: leg.eventName,
      playerName: leg.playerName || '',
      market: leg.market,
      line: leg.line,
      legOdds: leg.legOdds,
      note: leg.note || '',
      result: leg.result,
      order: index,
    })) ?? [{ ...emptyLeg, order: 0 }];
  const [title, setTitle] = useState(existing?.title ?? '');
  const [dateFor, setDateFor] = useState(existing ? existing.dateFor.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [risk, setRisk] = useState(existing?.risk?.toString() ?? '0');
  const [toWin, setToWin] = useState(existing?.toWin?.toString() ?? '0');
  const [odds, setOdds] = useState(existing?.odds ?? '');
  const [confidence, setConfidence] = useState(existing?.confidence ?? 5);
  const [status, setStatus] = useState(existing?.status ?? 'PENDING');
  const [isSpotlight, setIsSpotlight] = useState(existing?.isSpotlight ?? false);
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [legs, setLegs] = useState(existingLegs);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const addLeg = () => {
    setLegs((prev) => [...prev, { ...emptyLeg, order: prev.length }]);
  };

  const updateLeg = (index: number, field: string, value: string) => {
    setLegs((prev) => prev.map((leg, idx) => (idx === index ? { ...leg, [field]: value } : leg)));
  };

  const removeLeg = (index: number) => {
    setLegs((prev) => prev.filter((_, idx) => idx !== index).map((leg, idx) => ({ ...leg, order: idx })));
  };

  const submit = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        title,
        dateFor,
        risk: Number(risk),
        toWin: Number(toWin),
        odds,
        confidence: Number(confidence),
        status,
        isSpotlight,
        imageUrl: imageUrl || undefined,
        notes: notes || undefined,
        description: existing?.description ?? undefined,
        legs: legs.map((leg, index) => ({
          ...leg,
          playerName: leg.playerName || undefined,
          note: leg.note || undefined,
          result: 'PENDING',
          order: index,
        })),
      };

      const res = await fetch(existing ? `/api/parlays/${existing.id}` : '/api/parlays', {
        method: existing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed');
      }

      setMessage('Saved successfully');
    } catch (error: any) {
      setMessage(error.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-surface-800/80 p-6">
      <div>
        <h3 className="font-display text-2xl">{existing ? 'Update parlay' : 'Create new parlay'}</h3>
        <p className="text-sm text-white/60">Spotlight toggles will override other parlays for the same day.</p>
      </div>
      {message && <p className="rounded-2xl bg-black/30 p-3 text-sm text-white/80">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Title
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="text-sm">
          Date
          <input type="date" className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={dateFor} onChange={(e) => setDateFor(e.target.value)} />
        </label>
        <label className="text-sm">
          Risk
          <input type="number" className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={risk} onChange={(e) => setRisk(e.target.value)} />
        </label>
        <label className="text-sm">
          To win
          <input type="number" className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={toWin} onChange={(e) => setToWin(e.target.value)} />
        </label>
        <label className="text-sm">
          Odds
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={odds} onChange={(e) => setOdds(e.target.value)} />
        </label>
        <label className="text-sm">
          Confidence (1-10)
          <input type="number" min={1} max={10} className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} />
        </label>
        <label className="text-sm">
          Status
          <select className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
            <option value="PUSH">Push</option>
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={isSpotlight} onChange={(e) => setIsSpotlight(e.target.checked)} /> Spotlight
        </label>
        <label className="text-sm md:col-span-2">
          Image URL
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </label>
        <label className="text-sm md:col-span-2">
          Notes
          <textarea className="w-full rounded-2xl border border-white/10 bg-white/5 p-3" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Legs</h4>
          <button type="button" onClick={addLeg} className="rounded-full border border-neon-teal px-4 py-2 text-sm text-neon-teal">
            Add leg
          </button>
        </div>
        {legs.map((leg, index) => (
          <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Leg {index + 1}</p>
              {legs.length > 1 && (
                <button type="button" onClick={() => removeLeg(index)} className="text-xs text-red-300">
                  Remove
                </button>
              )}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input placeholder="League" className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm" value={leg.league} onChange={(e) => updateLeg(index, 'league', e.target.value)} />
              <input placeholder="Event" className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm" value={leg.eventName} onChange={(e) => updateLeg(index, 'eventName', e.target.value)} />
              <input placeholder="Player" className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm" value={leg.playerName || ''} onChange={(e) => updateLeg(index, 'playerName', e.target.value)} />
              <input placeholder="Market" className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm" value={leg.market} onChange={(e) => updateLeg(index, 'market', e.target.value)} />
              <input placeholder="Line" className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm" value={leg.line} onChange={(e) => updateLeg(index, 'line', e.target.value)} />
              <input placeholder="Leg odds" className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm" value={leg.legOdds} onChange={(e) => updateLeg(index, 'legOdds', e.target.value)} />
              <textarea placeholder="Note" className="md:col-span-2 rounded-xl border border-white/10 bg-black/30 p-3 text-sm" value={leg.note || ''} onChange={(e) => updateLeg(index, 'note', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="w-full rounded-full bg-gradient-to-r from-neon-pink to-neon-teal px-6 py-3 font-semibold text-surface-900 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save parlay'}
      </button>
    </div>
  );
}
