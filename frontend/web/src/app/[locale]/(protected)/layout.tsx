import AuthWrapper from '@/components/wrappers/AuthWrapper';
import NotificationWrapper from '@/components/wrappers/NotificationWrapper';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import SidebarContextProvider from '@/components/providers/SidebarContextProvider';
import { TicketDetailsDialogProvider } from '@/components/providers/TicketDetailsDialogContextProvider';
import { ReactNode } from 'react';

export interface IMainLayout {
  children: ReactNode;
}

export default async function MainLayout({ children }: IMainLayout) {
  return (
    <AuthWrapper>
      <NotificationWrapper>
        <SidebarContextProvider>
          <TicketDetailsDialogProvider>
            <ProtectedLayout>{children}</ProtectedLayout>
          </TicketDetailsDialogProvider>
        </SidebarContextProvider>
      </NotificationWrapper>
    </AuthWrapper>
  );
}
