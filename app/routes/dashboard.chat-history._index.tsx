import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TablePagination } from '~/components';
import { Badge } from '~/components/ui/badge';
import { getSessions } from '~/services';
import { MessageType, Session } from '~/types';

export type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
};

export default function DashboardDocument() {
  const [sessions, setSessions] = useState<Session[]>([]);

  const { data } = useQuery({
    queryKey: ['session'],
    queryFn: () => getSessions(),
  });

  useEffect(() => {
    if (data) {
      setSessions(data);
    }
  }, [data]);

  const columns: ColumnDef<Session>[] = [
    {
      header: 'Mã cuộc trò chuyện',
      accessorKey: 'sessionId',
      cell: ({ row }) => {
        return <div className="line-clamp-1 w-fit text-left">{row.getValue('sessionId')}</div>;
      },
    },
    {
      header: () => (
        <span className="inline-block text-center">
          Số lượng <br /> tin nhắn
        </span>
      ),
      accessorKey: 'messages',
      cell: ({ row }) => {
        const messages: MessageType[] = row.getValue('messages');

        return <div className="w-full max-w-16 text-center">{messages.length}</div>;
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'isActive',
      cell: ({ row }) => {
        return (
          <div className="min-w-[120px] text-left">
            {row.getValue('isActive') ? (
              <Badge variant={'active'}>Hoạt động</Badge>
            ) : (
              <Badge variant={'inactive'}>Ngưng hoạt động</Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        const formattedDate = new Date(row.getValue('createdAt')).toLocaleDateString('vi-VN');
        return <div className="min-w-[120px] text-left">{formattedDate}</div>;
      },
    },
    {
      header: () => (
        <span className="inline-block text-center">
          Thời gian cập nhật <br /> gần nhất
        </span>
      ),
      accessorKey: 'updatedAt',
      cell: ({ row }) => {
        const formattedDate = new Date(row.getValue('updatedAt')).toLocaleString('vi-VN', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        return <div className="min-w-[120px] text-left">{formattedDate}</div>;
      },
    },
  ];

  return (
    <div className="container mx-auto space-y-4">
      <h1 className="text-3xl font-semibold">Danh sách cuộc trò chuyện</h1>
      <TablePagination columns={columns} data={sessions} />
    </div>
  );
}
