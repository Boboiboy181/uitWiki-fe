import { CalendarIcon, Link2Icon, UploadIcon } from '@radix-ui/react-icons';
import { Link, useNavigate, useParams } from '@remix-run/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loading } from '~/components';
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
import { Calendar } from '~/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { cn } from '~/lib/utils';
import { createNewDocument, deleteDocumentById, getDocumentById, uploadFile } from '~/services/document';
import { Document as DocumentType } from '~/types';

const DocumentDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [loadingIframe, setLoadingIframe] = useState(true);

  const { data } = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocumentById(id!),
    enabled: id !== 'add',
  });

  useEffect(() => {
    if (data) {
      setDocument({ ...data, ...data.metadata });
    }
  }, [data]);

  const form = useForm<DocumentType>({
    defaultValues: {
      title: '',
      author: '',
      description: '',
      publicdate: new Date(),
      isActive: true,
      documentUrl: '',
      documentKey: '',
      _id: '',
      createdAt: '',
      updatedAt: '',
      isDeleted: false,
      file: undefined,
      originalUrl: '',
      parseType: 'ocr',
    },
  });

  useEffect(() => {
    if (document) {
      const publicdate = document.publicdate ? new Date(document.publicdate) : new Date();
      form.reset({
        ...document,
        publicdate,
      });
    }
  }, [document, form]);

  const handleLoadIframe = () => {
    setLoadingIframe(false);
  };

  const { mutate: uploadDocument, isPending: isUploading } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await uploadFile(formData);
      return response;
    },
  });

  const { mutate: addDocument, isPending: isCreating } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) => createNewDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Thêm tài liệu thành công');
      navigate('/dashboard/document');
    },
    onError: () => {
      toast.error('Thêm tài liệu thất bại');
    },
  });

  const onSubmit = async (data: DocumentType) => {
    if (!data.file) {
      toast.error('Vui lòng chọn tài liệu');
      return;
    }

    const fileFormData = new FormData();
    fileFormData.append('file', data.file);

    uploadDocument(fileFormData, {
      onSuccess: (response) => {
        const { documentUrl, documentKey } = response;

        const documentData = {
          documentKey,
          documentUrl,
          parseType: data.parseType,
          metadata: {
            title: data.title,
            author: data.author,
            description: data.description,
            originalUrl: data.originalUrl,
            publicdate: data.publicdate,
          },
        };

        addDocument(documentData);
      },
      onError: () => {
        toast.error('Tải tài liệu lên thất bại');
      },
    });
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <h1 className="text-3xl font-semibold">
        {id === 'add' ? (
          'Thêm tài liệu'
        ) : (
          <span className="line-clamp-1 flex items-center gap-2">
            {document?.title}
            <Link to={document?.documentUrl || '#'} target="_blank" rel="noreferrer">
              <Link2Icon className="size-5 text-blue-600" />
            </Link>
          </span>
        )}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
          <div className="flex h-full flex-row-reverse gap-4">
            <div className="flex basis-1/2 flex-col gap-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tài liệu</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên tài liệu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tác giả</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tác giả" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mô tả" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="originalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liên kết tới tài liệu gốc</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập link tài liệu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publicdate"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Ngày xuất bản</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              '!mt-0 w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? format(field.value, 'PPP', { locale: vi }) : <span>Chọn ngày</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {id === 'add' && (
                <FormField
                  control={form.control}
                  name="parseType"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Phương thức xử lý tài liệu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={id !== 'add'}>
                        <FormControl>
                          <SelectTrigger className="!mt-0 w-[180px]">
                            <SelectValue placeholder="Chọn phương thức xử lý tài liệu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ocr">OCR</SelectItem>
                          <SelectItem value="llama">LLaMA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} defaultChecked={true} onCheckedChange={field.onChange} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {document?.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <p className="font-semibold">Ngày tạo:</p>
                  <p>
                    {new Date(document?.updatedAt || new Date()).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              )}
              {document?.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <p className="font-semibold">Ngày cập nhật gần nhất:</p>
                  <p>
                    {new Date(document?.updatedAt || new Date()).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              )}

              <div className="flex flex-1 items-end justify-between">
                <Link to="/dashboard/document">
                  <Button variant="outline">Quay trở lại</Button>
                </Link>
                <div className="flex gap-4">
                  <DeleteAlert
                    id={id!}
                    trigger={
                      <Button variant="destructive" disabled={id === 'add'}>
                        Xóa
                      </Button>
                    }
                  />
                  <Button type="submit" disabled={id !== 'add' || isUploading || isCreating}>
                    {isUploading ? 'Đang tải lên...' : isCreating ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex h-full flex-1 basis-1/2 flex-col items-center justify-center rounded-2xl border border-gray-200 p-4 shadow-lg">
              {document?.documentUrl ? (
                <Fragment>
                  {loadingIframe && <Loading />}
                  <iframe
                    title={document.title}
                    id="myFrame"
                    src={document.documentUrl}
                    width="100%"
                    height="100%"
                    onLoad={handleLoadIframe}
                    style={{ display: loadingIframe ? 'none' : 'block', borderRadius: '8px' }}
                  ></iframe>
                </Fragment>
              ) : (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem className="flex flex-col items-center justify-center">
                      <FormLabel
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-6
                          hover:border-primary"
                      >
                        <UploadIcon className="size-10" />
                        <p className="text-sm text-muted-foreground">Kéo thả hoặc click để tải tài liệu lên</p>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {value && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Đã chọn: {value instanceof File ? value.name : 'Unknown file'}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

function DeleteAlert({ id, trigger }: { id: string; trigger?: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate: deleteDoc, isPending } = useMutation({
    mutationFn: () => deleteDocumentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsOpen(false);
      navigate('/dashboard/document');
      toast.success('Xóa tài liệu thành công');
    },
    onError: () => {
      toast.error('Xóa tài liệu không thành công');
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Tài liệu này sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteDoc()} disabled={isPending}>
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DocumentDetailPage;
