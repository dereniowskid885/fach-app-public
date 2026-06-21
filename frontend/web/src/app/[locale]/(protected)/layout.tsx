import AuthWrapper from '@/components/features/auth/AuthWrapper';
import NotificationWrapper from '@/components/features/notification/NotificationWrapper';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import SidebarContextProvider from '@/components/providers/SidebarContextProvider';
import { ReactNode } from 'react';

export interface IMainLayout {
  children: ReactNode;
}

export default async function MainLayout({ children }: IMainLayout) {
  return (
    <AuthWrapper>
      <NotificationWrapper>
        <SidebarContextProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </SidebarContextProvider>
      </NotificationWrapper>
    </AuthWrapper>
  );
}
