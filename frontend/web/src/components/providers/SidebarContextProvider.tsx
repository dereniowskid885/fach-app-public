'use client';

import { SidebarContext } from '@/contexts/SidebarContext';
import { ReactNode, useState } from 'react';

export interface ISidebarContextProvider {
  children: ReactNode;
}

export default function SidebarContextProvider({ children }: ISidebarContextProvider) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const sidebarCollapsedWidth = 80;
  const sidebarExpandedWidth = 250;
  const sidebarWidth = isSidebarCollapsed ? sidebarCollapsedWidth : sidebarExpandedWidth;

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarCollapsed,
        sidebarCollapsedWidth,
        sidebarExpandedWidth,
        sidebarWidth,
        toggleSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
