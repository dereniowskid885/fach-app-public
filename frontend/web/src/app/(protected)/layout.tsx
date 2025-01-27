import Header from '@/components/ui/Header';
import Navigation from '@/components/ui/Navigation';
import { getTokenPayload } from '@/lib/token';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export interface IMainLayout {
  children: ReactNode;
}

export default async function MainLayout({ children }: IMainLayout) {
  const token = (await cookies()).get('accessToken');
  const tokenPayload = getTokenPayload(token?.value ?? '');

  if (!tokenPayload) {
    notFound();
  }

  return (
    <main className="h-full w-full overflow-hidden">
      <Header userName={tokenPayload.name} />
      {children}
      <Navigation />
    </main>
  );
}
