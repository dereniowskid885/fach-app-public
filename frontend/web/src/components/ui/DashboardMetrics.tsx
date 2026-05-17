import { Clock, CheckCircle, ClipboardList, MessageSquare, Bell, CreditCard } from 'lucide-react';
import { cn } from '@/utils/shared';
import { getTicketStatusColorClasses } from '@/helpers/ticket';
import { ETicketStatus } from 'shared-types';
import ContentCard from '../common/ContentCard';
import Typography from '../common/Typography';

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
      color: getTicketStatusColorClasses(ETicketStatus.AWAITING_PAYMENT)
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
      color: 'bg-chart-1 text-primary'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {widgets.map((widget, i) => (
        <ContentCard key={widget.id} index={i} className="space-y-4">
          <div className="flex items-start justify-between">
            <div className={cn('rounded-2xl border p-2.5', widget.color)}>
              <widget.icon size={22} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-black tracking-tighter text-primary">{widget.value}</p>

            <Typography variant="note-wide" as="p">
              {widget.label}
            </Typography>
          </div>
        </ContentCard>
      ))}
    </div>
  );
}
