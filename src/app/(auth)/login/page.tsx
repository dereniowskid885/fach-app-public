'use client';

import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Typography } from '@/components/ui/Typography';
import { DASHBOARD_PATH, REGISTER_PATH } from '@/constants/routes';
import { ILoginForm, loginHandler } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = useForm<ILoginForm>();

  const submitHandler = async (formData: ILoginForm) => {
    const result = await loginHandler(formData);

    if (result.success) {
      router.push(DASHBOARD_PATH);
    } else {
      setError('root', { message: result.error });
    }
  };

  return (
    <Card className="w-screen min-w-[300px] rounded-none border-none bg-primary-800 sm:w-auto">
      <CardHeader className="space-y-4 text-center lg:p-8">
        <CardTitle>
          <Typography variant="h1" className="italic">
            Issue solver
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="h3" className="font-normal text-white">
            Zaloguj się na swoje konto
          </Typography>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(submitHandler)}>
        <CardContent>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input {...register('email')} id="email" placeholder="jankowalski@gmail.com" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input {...register('password')} id="password" type="password" placeholder="******" />
            </div>
            {formState.errors.root && (
              <Typography variant="p" className="text-center font-bold text-error">
                {formState.errors.root.message}
              </Typography>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Zaloguj</Button>
          <Link href={REGISTER_PATH}>
            <Button variant="outline">Rejestracja</Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
