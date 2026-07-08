import { createContext, useContext } from 'react';

export interface ISidebarContext {
  isSidebarCollapsed: boolean;
  sidebarCollapsedWidth: number;
  sidebarExpandedWidth: number;
  sidebarWidth: number;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<ISidebarContext | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebarContext must be used within SidebarProvider');
  }

  return context;
};
