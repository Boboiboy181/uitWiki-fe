import { redirect } from '@remix-run/node';

export async function action() {
  return redirect('/login?logout=success', {
    headers: {
      'Set-Cookie': 'Authentication=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    },
  });
}

export default function Logout() {
  return null;
}
