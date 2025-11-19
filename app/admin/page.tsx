import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDailyParlays, getRecentHistory } from '@/lib/parlays';
import { ParlayForm } from '@/components/admin/ParlayForm';
import { AdminParlayList } from '@/components/admin/ParlayList';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const [today, history] = await Promise.all([getDailyParlays(), getRecentHistory(15)]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neon-gold">Dashboard</p>
          <h1 className="font-display text-3xl">Welcome back, {session.displayName}</h1>
          <p className="text-sm text-white/60">Manage spotlight parlays, history, and live board.</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-full border border-white/30 px-4 py-2 text-sm text-white/80" type="submit">
            Log out
          </button>
        </form>
      </div>
      <ParlayForm />
      <section className="rounded-3xl border border-white/10 bg-surface-800/80 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">Today&apos;s Parlays</h2>
            <p className="text-sm text-white/60">Use the quick actions to set spotlight or update results.</p>
          </div>
          <Link href="/" className="text-sm text-neon-teal">
            View public site
          </Link>
        </div>
        <AdminParlayList initialParlays={today} />
      </section>
      <section className="rounded-3xl border border-white/10 bg-surface-800/80 p-6">
        <h2 className="font-display text-2xl">Recent history</h2>
        <AdminParlayList initialParlays={history} range="history" />
      </section>
    </main>
  );
}
