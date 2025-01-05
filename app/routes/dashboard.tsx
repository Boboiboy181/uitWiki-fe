import { Separator } from '@radix-ui/react-separator';
import { MetaFunction, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { DashboardBreadcrumb, DashboardSidebar } from '~/components';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { Toaster } from '~/components/ui/sonner';
import { parseCookie } from '~/session';

export const meta: MetaFunction = () => {
  return [
    { title: 'UIT Wiki' },
    {
      name: 'description',
      content:
        'uitWiki is an interactive platform designed for UIT students, providing a comprehensive repository of university information, resources, and a chatbot for instant Q&A assistance.',
    },
  ];
};

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = parseCookie(cookieHeader || '');

  if (!cookieHeader || !cookie.Authentication) throw redirect('/login');

  return cookie.Authentication;
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear
            group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardBreadcrumb />
          </div>
        </header>
        <div className="flex h-full flex-1 flex-col p-4 pt-0 text-gray-900">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster position="top-center" richColors={true} />
    </SidebarProvider>
  );
}
