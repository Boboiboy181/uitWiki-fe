import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ChatBubbleIcon, FileIcon } from '@radix-ui/react-icons';
import { Separator } from '@radix-ui/react-separator';
import { redirect } from '@remix-run/node';
import { Link, Outlet, useLocation } from '@remix-run/react';
import uitLogo from '~/assets/svg/logo-uit.svg';
import { Avatar } from '~/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';
import { getSession } from '~/session';
import { useUser } from '~/store';

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSession(cookieHeader);

  if (!session.data.Authentication) {
    throw redirect('/login');
  }

  return { token: session.data.Authentication };
}

const items = [
  {
    title: 'Document',
    url: '/dashboard/document',
    icon: FileIcon,
  },
  {
    title: 'Chat History',
    url: '/dashboard/chat-history',
    icon: ChatBubbleIcon,
  },
];

export default function Dashboard() {
  const { pathname } = useLocation();
  const { user } = useUser();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard" className="h-fit">
                  <div className="flex h-full w-full items-center gap-2">
                    <img className="w-full max-w-12" src={uitLogo} alt="Trường Đại học Công nghệ Thông tin" />
                    <div className="flex w-full flex-col">
                      <p className="font-semibold">uitWiki Chatbot</p>
                      <p>v1.0.0</p>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url === pathname}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex h-full w-full items-center gap-2">
                  <Avatar className="h-full w-fit rounded-lg">
                    <AvatarImage
                      className="w-full max-w-12 rounded-lg"
                      src={'https://github.com/shadcn.png'}
                      alt={user.email}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="flex w-full flex-col">
                    <p className="font-semibold">{user.email}</p>
                    <p>{user.roles}</p>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear
            group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" asChild>
                    <Link to={'/dashboard'}>Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={cn('hidden md:block', pathname === '/dashboard' && 'md:hidden')} />
                <BreadcrumbItem>
                  <BreadcrumbPage>{items.find((item) => item.url === pathname)?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
