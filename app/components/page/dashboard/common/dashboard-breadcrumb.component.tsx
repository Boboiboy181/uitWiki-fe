import { Link, useLocation } from '@remix-run/react';
import { Fragment } from 'react/jsx-runtime';
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
    '/dashboard/faq': 'Câu hỏi thường gặp',
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
          <Fragment key={item.url}>
            <BreadcrumbItem key={item.url}>
              {index !== breadcrumbItems.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={item.url}>{item.title}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
