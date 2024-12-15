import { Link, useLocation } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TablePagination } from '~/components';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { getDocuments } from '~/services/document';
import { Document } from '~/types';

export type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
};

export default function DashboardDocument() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { pathname } = useLocation();

  const { data } = useQuery({
    queryKey: ['documents'],
    queryFn: () => getDocuments(),
  });

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newMapData = data.map(({ metadata, ...rest }: { metadata: any; rest: any }) => ({ ...rest, ...metadata }));
      setDocuments(newMapData);
    }
  }, [data]);

  const columns: ColumnDef<Document>[] = [
    {
      header: 'Tên tài liệu',
      accessorKey: 'title',
      cell: ({ row }) => {
        return <div className="line-clamp-1 max-w-[120px] text-left">{row.getValue('title')}</div>;
      },
    },
    {
      header: 'Tác giả',
      accessorKey: 'author',
      cell: ({ row }) => {
        return <div className="w-fit min-w-[120px] text-left">{row.getValue('author')}</div>;
      },
    },
    {
      header: 'Ngày xuất bản',
      accessorKey: 'publicdate',
      cell: ({ row }) => {
        return <div className="min-w-[120px] text-left">{row.getValue('publicdate')}</div>;
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'isActive',
      cell: ({ row }) => {
        return (
          <div className="min-w-[120px] text-left">
            {row.getValue('isActive') ? 'Đang hoạt động' : 'Ngưng hoạt động'}
          </div>
        );
      },
    },
    {
      header: 'Ngày cập nhật gần nhất',
      accessorKey: 'updatedAt',
      cell: ({ row }) => {
        const formattedDate = new Date(row.getValue('updatedAt')).toLocaleDateString('vi-VN');

        return <div className="min-w-[120px] text-left">{formattedDate}</div>;
      },
    },
    {
      accessorKey: 'documentUrl',
      header: () => <div className="text-left">Đường dẫn</div>,
      cell: ({ row }) => {
        return (
          <a className="line-clamp-1 w-fit max-w-40 text-left text-blue-500" href={row.getValue('documentUrl')}>
            {row.getValue('documentUrl')}
          </a>
        );
      },
    },
    {
      accessorKey: '_id',
      header: () => <div className="text-left">Thao tác</div>,
      cell: ({ renderValue }) => {
        return (
          <Link to={`${pathname}/${renderValue()}`} className="flex items-center gap-2">
            <Button className="text-white">Chi tiết</Button>
          </Link>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto space-y-4">
      <h1 className="text-3xl font-semibold">Danh sách tài liệu</h1>
      <div className="flex items-center justify-between">
        <Input placeholder="Filter emails..." className="max-w-sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Dropdown
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TablePagination columns={columns} data={documents} />
    </div>
  );
}
