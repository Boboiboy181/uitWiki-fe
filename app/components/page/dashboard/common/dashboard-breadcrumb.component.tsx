import { Link, useLocation } from '@remix-run/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export function DashboardBreadcrumb() {
  const { pathname } = useLocation();

  const pathTitles: Record<string, string> = {
    '/dashboard': 'Trang chủ',
    '/dashboard/document': 'Tài liệu',
    '/dashboard/chat-history': 'Lịch sử chat',
  };

  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      url,
      title: pathTitles[url] || segment,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.url}>
            {index !== breadcrumbItems.length - 1 ? (
              <BreadcrumbLink asChild>
                <Link to={item.url}>{item.title}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
