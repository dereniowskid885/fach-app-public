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
import { ILoginForm, login } from '@/lib/auth';
import { useForm } from 'react-hook-form';

export default function Home() {
  const { register, handleSubmit, formState, setError } = useForm<ILoginForm>();

  const submitHandler = async (formData: ILoginForm) => {
    const result = await login(formData);

    if (result.success) {
      console.log('login success');
    } else {
      setError('root', { message: result.error });
    }
  };

  return (
    <Card className="fixed left-[50%] top-[50%] w-screen min-w-[300px] translate-x-[-50%] translate-y-[-50%] border-none bg-primary-800 sm:w-auto">
      <CardHeader className="space-y-4 text-center">
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
          <Button>Zaloguj</Button>
          <Button variant="outline">Rejestracja</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
