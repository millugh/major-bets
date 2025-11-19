import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { getSession } from '@/lib/auth';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/admin');
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-8">
      <div className="rounded-3xl border border-white/10 bg-surface-800/80 p-8">
        <h1 className="font-display text-3xl">Major Login</h1>
        <p className="text-sm text-white/60">Single admin access only.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
