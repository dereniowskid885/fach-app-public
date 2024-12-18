import { Button } from '@/components/shadcn/button';
import { Typography } from '@/components/ui/Typography';
import { THEME_PATH, TYPOGRAPHY_PATH } from '@/constants/routes';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
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
      </div>
    </div>
  );
}
