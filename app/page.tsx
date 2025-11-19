import { Hero } from '@/components/Hero';
import { SpotlightCard } from '@/components/SpotlightCard';
import { ParlayBoard } from '@/components/ParlayBoard';
import { HistoryGrid } from '@/components/HistoryGrid';
import { StatsPanel } from '@/components/StatsPanel';
import { TwitterSection } from '@/components/TwitterSection';
import { LiveTicker } from '@/components/Ticker';
import { OddsGrid } from '@/components/OddsGrid';
import { getDailyParlays, getPerformanceSummary, getRecentHistory, getSpotlightParlay } from '@/lib/parlays';

export default async function HomePage() {
  const [spotlight, daily, history, performance] = await Promise.all([
    getSpotlightParlay(),
    getDailyParlays(),
    getRecentHistory(8),
    getPerformanceSummary(),
  ]);

  const twitterHandle = process.env.MAJOR_TWITTER_HANDLE || 'majorsbets';

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <Hero twitterHandle={twitterHandle} />
      <LiveTicker parlays={daily} />
      <SpotlightCard parlay={spotlight} />
      <ParlayBoard title="Daily Board" parlays={daily} />
      <HistoryGrid parlays={history} />
      <StatsPanel summary={performance} />
      <OddsGrid />
      <TwitterSection handle={twitterHandle} />
    </main>
  );
}
