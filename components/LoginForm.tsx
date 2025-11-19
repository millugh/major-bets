'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error ?? 'Login failed');
        setLoading(false);
        return;
      }
      router.push('/admin');
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="rounded-2xl bg-red-500/20 p-3 text-sm text-red-200">{error}</p>}
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-2xl border border-white/20 bg-white/5 p-3 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-2xl border border-white/20 bg-white/5 p-3 text-white"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-neon-teal to-neon-pink px-6 py-3 font-semibold text-surface-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Enter Dashboard'}
      </button>
    </form>
  );
}
