import { createCookieSessionStorage } from '@remix-run/node';

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'Authentication',
    secrets: ['some_secret'],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
  },
});
