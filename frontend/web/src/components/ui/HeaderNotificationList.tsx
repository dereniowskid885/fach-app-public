import { notifications } from '@/mocks/notifications';
import Typography from '@/components/ui/Typography';
import NotificationIcon from './NotificationIcon';

export default function HeaderNotificationList() {
  return (
    <ul>
      <div className="divide-y divide-muted-foreground">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="animation-base animation-idle animation-interactive flex items-start space-x-3 p-4"
          >
            <NotificationIcon type={notification.type} />

            <div className="flex min-w-0 flex-col gap-1">
              <Typography variant="small" className="text-primary-300">
                Fachowiec {notification.user}
              </Typography>
              <Typography variant="small" className="text-gray-400">
                {notification.message} {notification.ticketId}
              </Typography>
              <Typography variant="note" className="text-gray-500">
                {notification.time}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </ul>
  );
}
