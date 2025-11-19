import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

const SESSION_COOKIE = 'majors_session';
const SESSION_DAYS = 7;

const getJwtSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is missing');
  return new TextEncoder().encode(secret);
};

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

export type SessionPayload = {
  userId: string;
  role: 'ADMIN' | 'USER';
  email: string;
  displayName: string;
};

export const createSession = async (payload: SessionPayload) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_DAYS}d`)
    .setIssuedAt()
    .setSubject(payload.userId)
    .sign(getJwtSecret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: '/',
  });
};

export const destroySession = () => {
  cookies().delete(SESSION_COOKIE);
};

export const getSession = async (): Promise<SessionPayload | null> => {
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(cookie, getJwtSecret());
    return payload;
  } catch (error) {
    cookies().delete(SESSION_COOKIE);
    return null;
  }
};

export const requireAdmin = async () => {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new Error('Unauthorized');
  return user;
};
