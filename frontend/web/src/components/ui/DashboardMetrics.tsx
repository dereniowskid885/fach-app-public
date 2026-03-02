import { Clock, CheckCircle, ClipboardList, MessageSquare, Bell, CreditCard } from 'lucide-react';
import { Card, CardContent } from '../shadcn/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getTicketStatusColorClasses } from '@/constants/ticketStatus';
import { ETicketStatus } from '@shared/constants/enums';

export default function DashboardMetrics() {
  // TODO: replace after creation of metrics endpoints
  const widgets = [
    {
      id: 'dashboard-metric-1',
      label: 'Sprawy w toku',
      value: '08',
      icon: Clock,
      color: getTicketStatusColorClasses(ETicketStatus.IN_PROGRESS)
    },
    {
      id: 'dashboard-metric-2',
      label: 'Sprawy oczekujące na płatność',
      value: '02',
      icon: CreditCard,
      color: getTicketStatusColorClasses(ETicketStatus.PENDING_PAYMENT)
    },
    {
      id: 'dashboard-metric-3',
      label: 'Otwarte sprawy',
      value: '12',
      icon: ClipboardList,
      color: getTicketStatusColorClasses()
    },
    {
      id: 'dashboard-metric-4',
      label: 'Ukończone sprawy',
      value: '04',
      icon: CheckCircle,
      color: getTicketStatusColorClasses(ETicketStatus.COMPLETED)
    },
    {
      id: 'dashboard-metric-5',
      label: 'Nowe wiadomości',
      value: '02',
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    {
      id: 'dashboard-metric-6',
      label: 'Nowe powiadomienia',
      value: '03',
      icon: Bell,
      color: 'bg-chart-5 text-primary border-chart-5'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {widgets.map((widget, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          key={widget.id}
        >
          <Card className="rounded-2xl border shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={cn('rounded-xl border p-2.5', widget.color)}>
                  <widget.icon size={22} />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-black tracking-tighter text-primary">{widget.value}</p>
                <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{widget.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
