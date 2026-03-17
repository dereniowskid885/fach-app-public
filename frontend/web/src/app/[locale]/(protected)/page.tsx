import DashboardGreeting from '@/components/ui/DashboardGreeting';
import DashboardMetrics from '@/components/ui/DashboardMetrics';
import DashboardRecentTickets from '@/components/ui/DashboardRecentTickets';

export default function Home() {
  return (
    <>
      <DashboardGreeting />

      <DashboardMetrics />

      <DashboardRecentTickets />
    </>
  );
}
