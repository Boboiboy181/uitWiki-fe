import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ChatBubbleIcon, FileIcon } from '@radix-ui/react-icons';
import { Link, useLocation } from '@remix-run/react';
import uitLogo from '~/assets/svg/logo-uit.svg';
import { Avatar } from '~/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { useUser } from '~/store';

const items = [
  {
    title: 'Tài liệu',
    url: '/dashboard/document',
    icon: FileIcon,
  },
  {
    title: 'Lịch sử chat',
    url: '/dashboard/chat-history',
    icon: ChatBubbleIcon,
  },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { user } = useUser();

  return (
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
  );
}
