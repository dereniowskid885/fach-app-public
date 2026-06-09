'use client';

import { ReactNode } from 'react';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import { motion } from 'framer-motion';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useThemeHandler } from '@/hooks/useThemeHandler';

export interface IProtectedLayout {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: IProtectedLayout) {
  const { sidebarWidth, isSidebarCollapsed } = useSidebarContext();

  useThemeHandler();

  return (
    <main className="bg-background flex min-h-dvh">
      <Header />
      <Sidebar />

      <motion.div
        initial={false}
        animate={{
          '--sidebar-offset': `${sidebarWidth}px`
        }}
        className={`h-vdh animate-margin-left mt-24 w-full min-w-0 p-4 sm:p-8`}
      >
        <motion.div
          animate={{ maxWidth: isSidebarCollapsed ? 1600 : 1280 }}
          className="mx-auto max-w-7xl space-y-8"
        >
          {children}
        </motion.div>
      </motion.div>
    </main>
  );
}
