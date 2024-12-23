import { sha256 } from '@oslojs/crypto/sha2';
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding';
import { Discord, GitHub, Google } from 'arctic';
import { deleteCookie, getCookie, setCookie } from 'vinxi/http';
import { PrismaClient } from '@prisma/client';

import { Session } from '@prisma/client';

export const SESSION_COOKIE_NAME = 'session';

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const prismaClient = new PrismaClient();
  const session = await prismaClient.session.create({
    data: {
      id: sessionId,
      userId: userId,
      sessionToken: token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });
  return session;
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const prismaClient = new PrismaClient();
  const sessionWithUser = await prismaClient.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!sessionWithUser) {
    return { session: null, user: null };
  }

  const { user, ...session } = sessionWithUser;

  if (Date.now() >= session.expires.getTime() - 1000 * 60 * 60 * 24 * 15) {
    await prismaClient.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }

  return { session, user };
}

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof validateSessionToken>>['user']
>;

export async function invalidateSession(sessionId: string): Promise<void> {
  const prismaClient = new PrismaClient();
  await prismaClient.session.delete({ where: { id: sessionId } });
}

export function setSessionTokenCookie(token: string, expiresAt: Date) {
  setCookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

// OAuth2 Providers
export const discord = new Discord(
  process.env.DISCORD_CLIENT_ID as string,
  process.env.DISCORD_CLIENT_SECRET as string,
  process.env.NODE_ENV === 'production'
    ? (process.env.DISCORD_REDIRECT_URI as string)
    : 'http://localhost:3000/api/auth/callback/discord',
);
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID as string,
  process.env.GITHUB_CLIENT_SECRET as string,
  process.env.NODE_ENV === 'production'
    ? (process.env.GITHUB_REDIRECT_URI as string)
    : 'http://localhost:3000/api/auth/callback/github',
);
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  process.env.NODE_ENV === 'production'
    ? (process.env.GOOGLE_REDIRECT_URI as string)
    : 'http://localhost:3000/api/auth/callback/google',
);

/**
 * Retrieves the session and user data if valid.
 * Can be used in API routes and server functions.
 */
export async function getAuthSession(
  { refreshCookie } = { refreshCookie: true },
) {
  const token = getCookie(SESSION_COOKIE_NAME);
  if (!token) {
    return { session: null, user: null };
  }
  const { session, user } = await validateSessionToken(token);
  if (session === null) {
    deleteCookie(SESSION_COOKIE_NAME);
    return { session: null, user: null };
  }
  if (refreshCookie) {
    setSessionTokenCookie(token, session.expires);
  }
  return { session, user };
}
