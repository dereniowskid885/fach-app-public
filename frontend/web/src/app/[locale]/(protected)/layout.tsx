import AuthWrapper from '@/components/hoc/AuthWrapper';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import SidebarContextProvider from '@/components/providers/SidebarContextProvider';
import { ReactNode } from 'react';

export interface IMainLayout {
  children: ReactNode;
}

export default async function MainLayout({ children }: IMainLayout) {
  return (
    <AuthWrapper>
      <SidebarContextProvider>
        <ProtectedLayout>{children}</ProtectedLayout>
      </SidebarContextProvider>
    </AuthWrapper>
  );
}
