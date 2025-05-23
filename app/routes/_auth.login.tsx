import { zodResolver } from '@hookform/resolvers/zod';
import { MetaFunction, type ActionFunctionArgs } from '@remix-run/node';
import { redirect, useFetcher, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { login } from '~/services';
import { parseCookie } from '~/session';
import { useUser } from '~/store';
import { User } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'UIT Wiki' },
    {
      name: 'description',
      content:
        'uitWiki is an interactive platform designed for UIT students, providing a comprehensive repository of university information, resources, and a chatbot for instant Q&A assistance.',
    },
  ];
};

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = parseCookie(cookieHeader || '');

  if (!cookieHeader || !cookie.Authentication) return null;

  return redirect('/dashboard');
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const response = await login(email, password);
  const { token } = response;

  if (!token) {
    return redirect('/login');
  }

  const setCookieHeader = `Authentication=${token}; Path=/; HttpOnly; SameSite=None; Max-Age=3600; Secure=true`;

  return Response.json({ response }, { headers: { 'Set-Cookie': setCookieHeader } });
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useUser();

  const fetcher = useFetcher({
    key: 'login',
  });

  useEffect(() => {
    const logoutParam = searchParams.get('logout');
    if (logoutParam === 'success') {
      setTimeout(() => {
        toast.success('Đăng xuất thành công', {
          id: 'logout',
        });
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    if (fetcher.state === 'loading' && fetcher.data) {
      const data = fetcher.data as {
        response: {
          user: User;
          token: string;
        };
      };
      setUser(data.response.user);
      setToken(data.response.token);
      toast.success('Đăng nhập thành công');
    }

    if (fetcher.state === 'idle' && fetcher.data === undefined && fetcher.formData) {
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
    }
  }, [fetcher.state, fetcher.data, fetcher.formData, setUser, setToken]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center gap-12">
      <Avatar className="size-20">
        <AvatarImage src="https://avatars.githubusercontent.com/u/16943930?s=200&v=4" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="mb-10 flex w-[350px] flex-col items-center justify-center gap-4">
        <h1 className="text-center text-3xl font-semibold">Chào mừng quay trở lại</h1>
        <Form {...form}>
          <fetcher.Form method="post" action="/login" className="flex w-full flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} autoComplete="current-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="veryverysecret" {...field} autoComplete="current-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={'default'} className="w-full bg-primary">
              Login
            </Button>
          </fetcher.Form>
        </Form>
      </div>
      <p className="absolute bottom-4 text-sm">
        Nếu gặp sự cố, liên hệ với chúng mình tại{' '}
        <a href="mailto:uitwiki@gmail.com" className="text-primary underline">
          uitwiki@gmail.com
        </a>
      </p>
    </div>
  );
}
