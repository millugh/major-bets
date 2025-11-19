import Link from 'next/link';

type HeroProps = {
  twitterHandle: string;
};

export function Hero({ twitterHandle }: HeroProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-800/90 via-surface-700/80 to-surface-900/80 p-8 shadow-glow">
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(102,246,255,0.25),transparent_45%),radial-gradient(circle_at_bottom,_rgba(241,81,255,0.35),transparent_50%)]" />
      </div>
      <div className="relative z-10 flex flex-col gap-6 text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">Parlays that pour</p>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">Major&apos;s Bets</h1>
          <p className="mx-auto mt-2 max-w-2xl text-base text-white/70">
            Live spotlight parlays, CLV stats, and real-time odds for the boldest betting community online. Stay locked on the daily stack and tap into verified results.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="#spotlight" className="rounded-full bg-gradient-to-r from-neon-teal to-neon-pink px-6 py-3 text-sm font-semibold text-surface-900 shadow-lg shadow-neon-teal/30 transition hover:-translate-y-0.5">
            Today&apos;s Spotlight
          </Link>
          <a
            href={`https://twitter.com/${twitterHandle}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-neon-teal hover:text-white"
          >
            Get Alerts
          </a>
        </div>
      </div>
    </header>
  );
}
