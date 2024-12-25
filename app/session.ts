import { createCookie } from '@remix-run/node';
import * as cookie from 'cookie';

export const authCookie = createCookie('Authentication', {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60,
});

export const parseCookie = (cookieValue: string) => {
  return cookie.parse(cookieValue);
};
