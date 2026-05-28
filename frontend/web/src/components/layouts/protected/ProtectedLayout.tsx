'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useSyncTheme } from '@/hooks/useSyncTheme';

export interface IProtectedLayout {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: IProtectedLayout) {
  const { sidebarWidth, isSidebarCollapsed } = useSidebarContext();

  useSyncTheme();

  return (
    <main className="flex min-h-dvh bg-background">
      <Header />
      <Sidebar />

      <motion.div
        initial={false}
        animate={{
          marginLeft: sidebarWidth
        }}
        className={`h-vdh mt-[90px] w-full p-8 ml-[${sidebarWidth}px] min-w-0`}
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
