import DashboardGreeting from '@/app/[locale]/(protected)/_components/DashboardGreeting';
// import DashboardMetrics from '@/app/[locale]/(protected)/_components/DashboardMetrics';
import DashboardRecentTickets from '@/app/[locale]/(protected)/_components/DashboardRecentTickets';

export default function Home() {
  return (
    <>
      <DashboardGreeting />

      {/* <DashboardMetrics /> */}

      <DashboardRecentTickets />
    </>
  );
}
