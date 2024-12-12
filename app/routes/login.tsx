import { zodResolver } from '@hookform/resolvers/zod';
import { type ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { login } from '~/services';
import { commitSession, getSession } from '~/session';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const response = await login(email, password);
  const token = response.token;

  if (!token) {
    return { error: 'Login failed' };
  }

  const session = await getSession();
  session.set('Authentication', token);

  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export default function Login() {
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
        <h1 className="text-center text-3xl font-semibold">Welcome Back</h1>
        <Form {...form}>
          <form method="post" action="/login" className="flex w-full flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={'default'} className="w-full bg-primary">
              Login
            </Button>
          </form>
        </Form>
      </div>
      <p className="absolute bottom-4 text-sm">
        If you have any problem, please contact us at{' '}
        <a href="mailto:uitwiki@gmail.com" className="text-primary underline">
          uitwiki@gmail.com
        </a>
      </p>
    </div>
  );
}
