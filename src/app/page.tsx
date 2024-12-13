'use client';

import { Button } from '@/components/shadcn/button';
import { Typography } from '@/components/ui/Typography';
import { LOGIN_PATH, THEME_PATH, TYPOGRAPHY_PATH } from '@/constants/routes';
import { deleteCookie } from '@/lib/serverHelpers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token').then(() => router.push(LOGIN_PATH));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Typography variant="h2" className="text-white">
        Dashboard
      </Typography>
      <div className="flex gap-4">
        <Link href={THEME_PATH}>
          <Button>Theme showcase</Button>
        </Link>
        <Link href={TYPOGRAPHY_PATH}>
          <Button>Typography showcase</Button>
        </Link>
        <Button onClick={handleLogout}>Wyloguj</Button>
      </div>
    </div>
  );
}
