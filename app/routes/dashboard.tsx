import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ChatBubbleIcon, FileIcon } from '@radix-ui/react-icons';
import { redirect } from '@remix-run/node';
import { Link, Outlet, useLocation } from '@remix-run/react';
import uitLogo from '~/assets/svg/logo-uit.svg';
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
                  <div className="flex h-fit items-center gap-2">
                    <img className="size-12" src={uitLogo} alt="Trường Đại học Công nghệ Thông tin" />
                    <div className="flex flex-1 flex-col">
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
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="size-8 overflow-hidden rounded-full">
              <Avatar className="size-8 rounded-full">
                <AvatarImage src={'https://github.com/shadcn.png'} alt={'Hai'} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.email}</span>
              <span className="truncate text-xs">{user.roles}</span>
            </div>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear
            group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
