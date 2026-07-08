import Typography from '@/components/ui/Typography';
import NotificationIcon from './NotificationIcon';
import { ENotificationType, ESupportedLanguages, EUserRole } from 'shared-types';
import { getRelativeTime, getFormattedDate } from '@/utils/date';
import { BiBell } from 'react-icons/bi';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../shadcn/button';
import {
  useDeleteNotificationsByIdMutation,
  useDeleteNotificationsDeleteAllMutation
} from '@/services/api/generated/accountApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import CloseIcon from './CloseIcon';
import { Separator } from '../shadcn/separator';
import { getCapitalizedText, getUserFullName } from '@/utils/shared';
import { roleObj } from '@/constants/role';
import { getNotificationLinkByType } from '@/helpers/notification';
import { useTicketDetailsDialogContext } from '@/contexts/TicketDetailsDialogContext';
import { paginatedAccountApi } from '@/services/api/enhanced/paginatedAccountApi';
import InfiniteScroll from '../features/pagination/InfiniteScroll';

export default function HeaderNotificationList() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const { openTicketDetailsDialog } = useTicketDetailsDialogContext();

  const {
    data: notificationData,
    error: errorGetNotifications,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isError
  } = paginatedAccountApi.endpoints.getNotificationsInfinite.useInfiniteQuery({
    limit: 5
  });
  const notifications = notificationData?.pages.flatMap(page => page.data ?? []);
  const hasNextPage = !!notificationData?.pages[notificationData.pages.length - 1].nextCursor;

  const [triggerDelete, { error: errorMarkAsRead, isLoading: isLoadingMarkAsRead }] =
    useDeleteNotificationsByIdMutation();
  const [triggerDeleteAll, { error: errorMarkAllAsRead, isLoading: isLoadingMarkAllAsRead }] =
    useDeleteNotificationsDeleteAllMutation();

  useErrorHandler(errorGetNotifications || errorMarkAsRead || errorMarkAllAsRead);

  const deleteNotificationHandler = async (notificationId?: string) => {
    if (!notificationId) return;

    const { error } = await triggerDelete({
      id: notificationId
    });

    if (error) toast.error(t('errors.generic'));
  };

  const clearAllHandler = async () => {
    const { error } = await triggerDeleteAll();

    if (error) toast.error(t('errors.generic'));
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="ghost"
        onClick={clearAllHandler}
        disabled={notifications?.length === 0 || isLoadingMarkAllAsRead}
      >
        {t('common.clearAll')}
      </Button>

      <Separator />

      <ul className="divide-border no-scrollbar max-h-[75dvh] divide-y overflow-y-auto">
        <InfiniteScroll
          onLoadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoadingMarkAllAsRead || (isFetching && !isFetchingNextPage)}
          isLoadingMore={isFetchingNextPage}
          itemCount={notifications?.length ?? 0}
          isError={isError}
          emptyElement={
            <>
              <BiBell size={28} className="text-muted-foreground/70" />

              <Typography variant="muted" className="text-muted-foreground/70 text-center">
                {t('notifications.empty')}
              </Typography>
            </>
          }
        >
          {notifications?.map(notification => (
            <li
              key={notification._id}
              className={`animation-hover relative flex items-start space-x-3 p-4 pr-8 ${isLoadingMarkAsRead ? 'animate-pulse' : ''}`}
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
                      ),
                      i: chunks => <i>{chunks}</i>
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
                            className="text-chart-3 animation-hover font-semibold"
                          >
                            {chunks}
                          </a>
                        ),
                        u: chunks => (
                          <u
                            className="text-chart-3 animation-hover mt-2 block cursor-pointer"
                            onClick={() =>
                              openTicketDetailsDialog(notification.ticket?._id, {
                                scrollToInput:
                                  notification.type === ENotificationType.COMMENT_ADDED
                                    ? true
                                    : false
                              })
                            }
                          >
                            {chunks}
                          </u>
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
                className="absolute top-2 right-2"
                onClick={() => deleteNotificationHandler(notification._id)}
              />
            </li>
          ))}
        </InfiniteScroll>
      </ul>
    </div>
  );
}
