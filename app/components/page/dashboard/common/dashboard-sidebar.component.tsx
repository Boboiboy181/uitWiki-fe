import { ChatBubbleIcon, ExitIcon, FileIcon, UpdateIcon } from '@radix-ui/react-icons';
import { Link, useLocation } from '@remix-run/react';
import uitLogo from '~/assets/svg/logo-uit.svg';
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
  {
    title: 'Câu hỏi thường gặp',
    url: '/dashboard/faq',
    icon: UpdateIcon,
  },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();

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
                  <SidebarMenuButton asChild isActive={item.url === pathname} tooltip={item.title}>
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
            <form method="post" action="/logout">
              <SidebarMenuButton tooltip={'Đăng xuất'} className="w-fit hover:bg-red-500 hover:text-white">
                <ExitIcon />
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
