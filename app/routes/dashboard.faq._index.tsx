import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loading, TablePagination } from '~/components';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useIsClient } from '~/hooks';
import { formatTime } from '~/lib/utils';
import { createCachedKey, deleteCachedKeyById, getAllCachedKeys, getCachedKeyById, updateCachedKey } from '~/services';
import { RedisKey } from '~/types';

export default function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ['redis-keys'],
    queryFn: () => getAllCachedKeys(),
    refetchOnMount: true,
    select: (data) => {
      return data.cached_items as RedisKey[];
    },
  });

  const columns: ColumnDef<RedisKey>[] = [
    {
      header: 'Câu hỏi',
      accessorKey: 'question',
      cell: ({ row }) => <p>{row.getValue('question')}</p>,
    },
    {
      header: 'Trả lời',
      accessorKey: 'response',
      cell: ({ row }) => <p className="line-clamp-1 max-w-64">{row.getValue('response')}</p>,
      size: 300,
    },
    {
      header: 'Ngày tạo',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        const formattedDate = formatTime(row.getValue('created_at'));

        return <div className="text-left">{formattedDate}</div>;
      },
    },
    {
      header: 'Ngày cập nhật',
      accessorKey: 'updated_at',
      cell: ({ row }) => {
        const formattedDate = formatTime(row.getValue('updated_at'));

        return <div className="text-left">{formattedDate}</div>;
      },
    },
    {
      accessorKey: 'key',
      header: () => <div className="text-left">Thao tác</div>,
      cell: ({ renderValue }) => {
        const key = (renderValue() as string).split(':').pop();

        return (
          <div className="flex gap-2">
            <CachedDetails
              id={key!}
              trigger={
                <Button>
                  <Pencil1Icon />
                </Button>
              }
            />
            <DeleteAlert
              id={key!}
              trigger={
                <Button variant={'destructive'}>
                  <TrashIcon />
                </Button>
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto h-full space-y-4">
      <h1 className="text-3xl font-semibold">Câu hỏi thường gặp</h1>
      <div className="flex items-center justify-between">
        <Input placeholder="Tìm kiếm tài liệu" className="max-w-sm" />
        <CachedDetails
          id=""
          trigger={
            <Button className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-300">Thêm mới</Button>
          }
        />
      </div>
      {isLoading ? (
        <div className="flex h-1/2 w-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <TablePagination columns={columns} data={data!} />
      )}
    </div>
  );
}

const formSchema = z.object({
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  response: z.string().min(1, 'Câu trả lời không được để trống'),
});

function CachedDetails({ id, trigger }: { id?: string; trigger?: React.ReactNode }) {
  const [action, setAction] = useState<'create' | 'update'>('create');
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useIsClient();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      response: '',
    },
  });

  const { data } = useQuery({
    queryKey: ['cached-item', id],
    queryFn: () => getCachedKeyById(id!),
    enabled: !!id && isOpen,
    staleTime: 0,
  });

  const { mutate: createCache, isPending: isCreating } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => createCachedKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redis-keys'] });
      setIsOpen(false);
      form.reset();
    },
  });

  const { mutate: updateCache, isPending: isUpdating } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => updateCachedKey(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redis-keys'] });
      setIsOpen(false);
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        question: data.question,
        response: data.response,
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (id) {
      setAction('update');
    } else {
      setAction('create');
      form.reset({
        question: '',
        response: '',
      });
    }
  }, [id, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (action === 'create') {
      createCache(values);
    } else {
      updateCache(values);
    }
  };

  return (
    isClient && (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{action === 'create' ? 'Thêm câu hỏi mới' : 'Cập nhật câu hỏi'}</DialogTitle>
            <DialogDescription>
              {action === 'create'
                ? 'Thêm câu hỏi và câu trả lời mới vào hệ thống.'
                : 'Chỉnh sửa nội dung câu hỏi và câu trả lời.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Câu hỏi</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập câu hỏi..." {...field} disabled={action === 'update'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Câu trả lời</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Nhập câu trả lời..."
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogTrigger>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !form.formState.isValid || !form.formState.isDirty}
                >
                  {action === 'create'
                    ? isCreating
                      ? 'Đang thêm...'
                      : 'Thêm mới'
                    : isUpdating
                      ? 'Đang cập nhật...'
                      : 'Cập nhật'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );
}

function DeleteAlert({ id, trigger }: { id: string; trigger?: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteCache, isPending } = useMutation({
    mutationFn: () => deleteCachedKeyById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redis-keys'] });
      setIsOpen(false);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Câu hỏi này sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteCache()} disabled={isPending}>
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
