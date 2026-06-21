import Typography from '@/components/ui/Typography';
import NotificationIcon from './NotificationIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAllNotifications,
  deleteNotification,
  selectNotificationData
} from '@/redux/slices/notificationSlice';
import { ENotificationType, ESupportedLanguages, EUserRole } from 'shared-types';
import { getRelativeTime, getFormattedDate } from '@/utils/date';
import ContentSection from './ContentSection';
import { BiBell } from 'react-icons/bi';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../shadcn/button';
import {
  usePatchNotificationsByIdReadMutation,
  usePatchNotificationsReadAllMutation
} from '@/services/api/generated/accountApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import CloseIcon from './CloseIcon';
import { Separator } from '../shadcn/separator';
import { getCapitalizedText, getUserFullName } from '@/utils/shared';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { roleObj } from '@/constants/role';
import { getNotificationLinkByType } from '@/helpers/notification';

export default function HeaderNotificationList() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const dispatch = useDispatch();
  const { notifications } = useSelector(selectNotificationData);

  const [triggerMarkAsRead, { error: errorMarkAsRead, isLoading: isLoadingMarkAsRead }] =
    usePatchNotificationsByIdReadMutation();
  const [triggerMarkAllAsRead, { error: errorMarkAllAsRead, isLoading: isLoadingMarkAllAsRead }] =
    usePatchNotificationsReadAllMutation();

  useErrorHandler(errorMarkAsRead || errorMarkAllAsRead);

  const deleteNotificationHandler = async (notificationId?: string) => {
    if (!notificationId) return;

    const { error } = await triggerMarkAsRead({
      id: notificationId
    });

    if (error) {
      toast.error(t('errors.generic'));

      return;
    }

    dispatch(deleteNotification(notificationId));
  };

  const clearAllHandler = async () => {
    const { error } = await triggerMarkAllAsRead();

    if (error) {
      toast.error(t('errors.generic'));

      return;
    }

    dispatch(deleteAllNotifications());
  };

  return notifications.length === 0 ? (
    <ContentSection
      bgTransparent={true}
      className="m-auto flex w-fit flex-col items-center justify-center p-6"
    >
      <BiBell size={28} className="text-muted-foreground/70" />

      <Typography variant="muted" className="text-muted-foreground/70 text-center">
        {t('notifications.empty')}
      </Typography>
    </ContentSection>
  ) : (
    <div className="flex flex-col gap-2">
      <Button variant="ghost" onClick={clearAllHandler}>
        {t('common.clearAll')}
      </Button>

      <Separator />

      {isLoadingMarkAllAsRead ? (
        <div className="py-4">
          <LoadingSpinner className="m-auto" />
        </div>
      ) : (
        <ul className="divide-border divide-y">
          {notifications.map(notification => (
            <li
              key={notification._id}
              className={`animation-hover relative flex items-start space-x-3 p-4 pr-6 ${isLoadingMarkAsRead ? 'animate-pulse' : ''}`}
            >
              <NotificationIcon type={notification.type as ENotificationType} />

              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Typography variant="small" className="text-foreground font-bold">
                    {t(`notifications.title.${notification.type}`)}
                  </Typography>

                  <Typography variant="note" as="p" className="line-clamp-3 leading-relaxed">
                    {t.rich(`notifications.description.${notification.type}`, {
                      actor: getUserFullName(notification.actor),
                      actorRole: getCapitalizedText(notification.actor?.role),
                      message: notification.message ?? '',
                      ticketTitle: notification.ticket?.title ?? '',
                      span: chunks => (
                        <span className={roleObj[notification.actor?.role as EUserRole].textClass}>
                          {chunks}
                        </span>
                      )
                    })}
                  </Typography>

                  {t.has(`notifications.additionalInfo.${notification.type}`) ? (
                    <Typography variant="note" as="p">
                      {t.rich(`notifications.additionalInfo.${notification.type}`, {
                        a: chunks => (
                          <a
                            href={getNotificationLinkByType(
                              currentLocale as ESupportedLanguages,
                              notification.type
                            )}
                            className="text-chart-3 font-bold"
                          >
                            {chunks}
                          </a>
                        )
                      })}
                    </Typography>
                  ) : null}
                </div>

                <Typography
                  variant="note"
                  className="font-semibold"
                  title={getFormattedDate(notification.updatedAt)}
                >
                  {getRelativeTime(t, notification.createdAt)}
                </Typography>
              </div>

              <CloseIcon
                className="absolute top-0 right-2"
                onClick={() => deleteNotificationHandler(notification._id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
