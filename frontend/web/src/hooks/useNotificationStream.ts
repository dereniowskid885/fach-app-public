/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationSlice';
import { API } from '@/constants/api';
import { enhancedAccountApi } from '@/services/api/enhanced/enhancedAccountApi';
import { accountApi } from '@/services/api/generated/accountApi';
import { usePathname } from 'next/navigation';
import { getCurrentRouteName, normalizePathname } from '@/utils/pathname';
import { useLocale } from 'next-intl';
import { ENotificationType, ESupportedLanguages } from 'shared-types';
import { NOTIFICATION_UPDATE_QUERY_ENDPOINTS_MAP } from '@/mappings/updateQueryEndpoints';

export const useNotificationStream = () => {
  const dispatch = useDispatch<any>();

  const pathname = usePathname();
  const locale = useLocale();
  const normalized = normalizePathname(pathname, locale);
  const currentRoute = getCurrentRouteName(normalized, locale as ESupportedLanguages);

  useEffect(() => {
    const source = new EventSource(API.NOTIFICATION_STREAM, {
      withCredentials: true
    });

    source.onmessage = event => {
      const notification = JSON.parse(event.data);
      dispatch(addNotification(notification));

      const isTicketDelete = notification.type === ENotificationType.ADMIN_TICKET_DELETED;

      if (isTicketDelete) {
        dispatch(accountApi.util.invalidateTags(['Ticketing']));

        return;
      }

      if (!notification.ticket) return;

      // update single ticket details (TicketDetailsDialog)
      dispatch(
        enhancedAccountApi.util.invalidateTags([{ type: 'Ticket', id: notification.ticket._id }])
      );

      const isEvaluationAccepted = notification.type === ENotificationType.USER_EVALUATION_ACCEPTED;
      const isSolutionAcceptOrReject = [
        ENotificationType.USER_SOLUTION_ACCEPTED,
        ENotificationType.USER_SOLUTION_REJECTED
      ].includes(notification.type);
      const isAdminTicketUpdate = [
        ENotificationType.ADMIN_TICKET_CATEGORY_UPDATED,
        ENotificationType.ADMIN_TICKET_CITY_UPDATED,
        ENotificationType.ADMIN_TICKET_STATUS_UPDATED
      ].includes(notification.type);

      // triggers ticket list refresh, when for ex. ticket is moved to another page
      if (isAdminTicketUpdate || isEvaluationAccepted || isSolutionAcceptOrReject) {
        dispatch(accountApi.util.invalidateTags(['Ticketing']));

        return;
      }

      // trigger comments refresh
      if (notification.type === ENotificationType.COMMENT_ADDED) {
        dispatch(accountApi.util.invalidateTags(['Comments']));
      }

      // update endpoint with specific ticket data
      const endpointToUpdate = NOTIFICATION_UPDATE_QUERY_ENDPOINTS_MAP[currentRoute];
      dispatch(
        accountApi.util.updateQueryData(endpointToUpdate as any, {}, (draft: any) => {
          const ticket = draft.data?.find((t: any) => t._id === notification.ticket._id);

          if (!ticket) return;

          Object.assign(ticket, notification.ticket);
        })
      );
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoute]);
};
