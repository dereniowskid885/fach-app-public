'use client';

import { ReactNode } from 'react';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import { motion } from 'framer-motion';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { useSyncTheme } from '@/hooks/useSyncTheme';

export interface IProtectedLayout {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: IProtectedLayout) {
  const { sidebarWidth } = useSidebarContext();

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
        className={`h-vdh mt-[90px] w-full p-8 ml-[${sidebarWidth}px]`}
      >
        {children}
      </motion.div>
    </main>
  );
}
