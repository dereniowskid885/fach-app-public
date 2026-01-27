import AuthWrapper from '@/components/hoc/AuthWrapper';
import Header from '@/components/ui/Header';
import Navigation from '@/components/ui/Navigation';
import { getUserData } from '@/lib/getUserData';
import { ReactNode } from 'react';

export interface IMainLayout {
  children: ReactNode;
}

export default async function MainLayout({ children }: IMainLayout) {
  const userData = await getUserData();
  const { name, role, categoryName } = userData;

  return (
    <AuthWrapper userData={userData}>
      <main className="h-full w-full">
        <Header userName={name} userRole={role} userCategory={categoryName} />
        {children}
        <Navigation />
      </main>
    </AuthWrapper>
  );
}
