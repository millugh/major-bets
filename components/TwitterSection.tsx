export function TwitterSection({ handle }: { handle: string }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-surface-800/80 p-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">Content Fuel</p>
          <h3 className="font-display text-2xl">Follow Major on X</h3>
        </div>
        <p className="text-sm text-white/70">
          Live cash-out calls, hedge alerts, and teaser drops hit X first. Tap in and turn on notifications.
        </p>
        <a
          href={`https://twitter.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-gold px-6 py-3 text-sm font-semibold text-surface-900 shadow-glow"
        >
          @{handle}
        </a>
      </div>
    </section>
  );
}
