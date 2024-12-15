import { Separator } from '@radix-ui/react-separator';
import { redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { DashboardBreadcrumb, DashboardSidebar } from '~/components';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { parseCookie } from '~/session';

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
        <div className="flex flex-1 flex-col p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
