import { NextResponse } from 'next/server';
import { fallbackOdds } from '@/lib/odds';

export async function GET() {
  const baseUrl = process.env.ODDS_API_BASE_URL;
  const apiKey = process.env.ODDS_API_KEY;

  if (!baseUrl || !apiKey) {
    return NextResponse.json({ events: fallbackOdds });
  }

  try {
    const response = await fetch(baseUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error('Bad odds response');
    const payload = await response.json();
    const events = Array.isArray(payload.events)
      ? payload.events.map((event: any) => ({
          sport: event.sport_key || event.sport_title || 'Sport',
          matchup: `${event.home_team ?? ''} @ ${event.away_team ?? ''}`.trim(),
          startTime: event.commence_time ?? 'TBD',
          spread: event.spreads?.points ? `${event.spreads.points} (${event.spreads.odds})` : undefined,
          moneyline: event.moneyline ?? undefined,
          total: event.totals?.points ? `${event.totals.points} (${event.totals.odds})` : undefined,
        }))
      : fallbackOdds;
    return NextResponse.json({ events });
  } catch (error) {
    console.warn('Failed to load odds', error);
    return NextResponse.json({ events: fallbackOdds });
  }
}
