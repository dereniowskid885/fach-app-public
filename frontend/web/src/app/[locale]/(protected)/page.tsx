'use client';

import DashboardGreeting from '@/components/ui/DashboardGreeting';
import DashboardMetrics from '@/components/ui/DashboardMetrics';
import DashboardTickets from '@/components/ui/DashboardTickets';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { motion } from 'framer-motion';

export default function Home() {
  const { isSidebarCollapsed } = useSidebarContext();

  return (
    <motion.div
      animate={{ maxWidth: isSidebarCollapsed ? 1600 : 1280 }}
      className="mx-auto flex w-full max-w-7xl flex-col gap-8"
    >
      <DashboardGreeting />

      <DashboardMetrics />

      <DashboardTickets />
    </motion.div>
  );
}
