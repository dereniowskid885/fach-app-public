import AuthWrapper from '@/components/wrappers/AuthWrapper';
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
      <SidebarContextProvider>
        <TicketDetailsDialogProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </TicketDetailsDialogProvider>
      </SidebarContextProvider>
    </AuthWrapper>
  );
}
