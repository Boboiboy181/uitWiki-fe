import { Link2Icon, UploadIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useNavigate, useParams } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loading } from '~/components';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { deleteDocumentById, getDocumentById } from '~/services/document';
import { Document as DocumentType } from '~/types';

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = request.headers.get('Cookie') || '';
  return auth;
}

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [loadingIframe, setLoadingIframe] = useState(true);
  const navigate = useNavigate();

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
    defaultValues: {} as DocumentType,
  });

  useEffect(() => {
    if (document) {
      form.reset(document);
    }
  }, [document, form]);

  const handleLoadIframe = () => {
    setLoadingIframe(false);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteDocumentById(id);
      navigate('/dashboard/document');
    } catch (error) {
      toast.error('Xóa không thành công');
    }
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
        <form className="flex-1">
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
                name="publicdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày xuất bản</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập ngày xuất bản" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 text-sm">
                <p className="font-semibold">Ngày tạo:</p>
                <p>
                  {new Date(document?.createdAt || new Date()).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
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

              <div className="flex flex-1 items-end justify-between">
                <Link to="/dashboard/document">
                  <Button variant="outline">Quay trở lại</Button>
                </Link>
                <div className="flex gap-4">
                  <Button variant="destructive" type="button" disabled={id === 'add'} onClick={() => handleDelete()}>
                    Xóa
                  </Button>
                  <Button type="submit" disabled={id !== 'add'}>
                    Lưu
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
                <UploadIcon className="size-10" />
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DocumentDetailPage;
