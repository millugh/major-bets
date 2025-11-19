import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, destroySession, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await destroySession();
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const match = await verifyPassword(password, user.passwordHash);
  if (!match) {
    await destroySession();
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
    displayName: user.displayName,
  });

  return NextResponse.json({ success: true });
}
