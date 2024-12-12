import { redirect } from '@remix-run/node';
import { getSession } from '~/session';

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSession(cookieHeader);

  if (!session.data.Authentication) {
    throw redirect('/login');
  }

  return { token: session.data.Authentication };
}

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
