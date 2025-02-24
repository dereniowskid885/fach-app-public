import { notifications } from '@/mocks/notifications';
import { Typography } from '../common/Typography';
import NotificationIcon from './NotificationIcon';

export default function HeaderNotificationList() {
  return (
    <ul>
      <div className="divide-y divide-neutral-400">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="flex items-start space-x-3 p-4 transition-colors duration-200 hover:bg-neutral-700"
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
