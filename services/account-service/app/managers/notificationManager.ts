import {
  ENotificationType,
  EResponseStatus,
  ETicketStatus,
  EUserRole,
  isAdmin,
  isSpecialist,
  isUser,
} from 'shared-types';
import Notification, { INotificationModel } from '@models/Notification';
import { AppError } from 'shared-backend';
import { IUserModel } from '@models/User';
import { ITicketModel } from '@models/Ticket';
import { UserManager } from './userManager';
import { TICKET_NON_ADMIN_STATUS_CHANGE_NOTIFICATION } from 'mappings/notification';
import { NotificationSSE } from '@sse/notification';
import { safeUserProjection } from '@constants/projections';
import { FilterQuery } from 'mongoose';

export const NotificationManager = {
  getUserNotifications: async (filter: FilterQuery<INotificationModel>) => {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .populate([{ path: 'actor', select: safeUserProjection }, { path: 'ticket' }]),
      Notification.countDocuments({ recipient: filter.recipient, isRead: false }),
    ]);

    return { notifications, unreadCount };
  },
  createNotification: async (
    notificationData: {
      actor: IUserModel;
      type: ENotificationType;
      ticketId: string;
      message?: string;
    },
    recipient: IUserModel,
  ) => {
    const notification = new Notification({
      recipient: recipient._id,
      actor: notificationData.actor._id,
      type: notificationData.type,
      ticket: notificationData.ticketId,
      message: notificationData.message,
    });

    await notification.save();
    await notification.populate([{ path: 'actor', select: safeUserProjection }, { path: 'ticket' }]);

    NotificationSSE.send(recipient._id.toString(), notification);

    return notification;
  },
  markAsRead: async (notificationId: string, userId: string) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true },
    ).populate([{ path: 'actor', select: safeUserProjection }, { path: 'ticket' }]);

    if (!notification) {
      throw new AppError(404, EResponseStatus.ERROR_NOTIFICATION_NOT_FOUND, 'Notification with provided ID not found');
    }

    return notification;
  },
  markAllAsRead: async (userId: string) => {
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true }).populate([
      { path: 'actor', select: safeUserProjection },
      { path: 'ticket' },
    ]);
  },
  handleSingleNotificationByType: async (
    type: ENotificationType,
    ticketId: string,
    recipient: IUserModel,
    actorId: string,
  ) => {
    const actor = await UserManager.getUserById(actorId);

    await NotificationManager.createNotification(
      {
        actor,
        type,
        ticketId,
      },
      recipient,
    );
  },
  handleNewTicketComment: async (ticketData: ITicketModel, commentMessage: string, actorId: string) => {
    const actor = await UserManager.getUserById(actorId);

    const specialist = ticketData.acceptedEvaluation?.user as IUserModel;
    const ticketCreator = ticketData.createdBy as IUserModel;

    const recipients = [];

    switch (actor.role) {
      case EUserRole.ADMIN:
        recipients.push(specialist, ticketCreator);
        break;

      case EUserRole.USER:
        recipients.push(specialist);
        break;

      case EUserRole.SPECIALIST:
        recipients.push(ticketCreator);
        break;

      default:
        return;
    }

    await Promise.all(
      recipients.map((recipient) =>
        NotificationManager.createNotification(
          {
            actor,
            type: ENotificationType.COMMENT_ADDED,
            ticketId: ticketData._id.toString(),
            message: commentMessage,
          },
          recipient as IUserModel,
        ),
      ),
    );
  },
  handleTicketUpdate: async (
    updateData: Partial<{
      categoryId: string;
      city: string;
      status: ETicketStatus;
      assigneeId: string;
      title: string;
      description: string;
    }>,
    ticket: ITicketModel,
    actorId: string,
    acceptedEvaluationSpecialist?: IUserModel,
  ) => {
    const actor = await UserManager.getUserById(actorId);

    const ticketCreator = ticket.createdBy as IUserModel;
    const specialist = acceptedEvaluationSpecialist
      ? acceptedEvaluationSpecialist
      : (ticket.acceptedEvaluation?.user as IUserModel);

    const { status, assigneeId, city, categoryId, ...rest } = updateData;

    if (isAdmin(actor.role)) {
      const isAssigneeUpdate = assigneeId !== undefined;
      const isCityUpdate = city !== undefined;
      const isCategoryUpdate = categoryId !== undefined;
      const isTicketDetailsUpdate = Object.values(rest).some((value) => value !== undefined);

      const notificationTypeMap = [
        [isAssigneeUpdate, ENotificationType.ADMIN_TICKET_ASSIGNEE_UPDATED],
        [isCityUpdate, ENotificationType.ADMIN_TICKET_CITY_UPDATED],
        [isCategoryUpdate, ENotificationType.ADMIN_TICKET_CATEGORY_UPDATED],
        [isTicketDetailsUpdate, ENotificationType.ADMIN_TICKET_DETAILS_UPDATED],
      ];

      // array with all notifications to be triggered
      const notificationTypes = notificationTypeMap.flatMap((arr) => {
        const [condition, type] = arr;

        if (!condition) return;

        return type as ENotificationType;
      });

      Promise.all(
        notificationTypes.map((type) => {
          if (!type) return;

          const recipients = [ticketCreator];

          if (specialist) recipients.push(specialist);

          return recipients.map((recipient) =>
            NotificationManager.createNotification(
              {
                actor,
                type,
                ticketId: ticket._id.toString(),
              },
              recipient,
            ),
          );
        }),
      );
    }

    const isTicketStatusUpdate = status !== undefined;

    if (isTicketStatusUpdate) {
      const notificationData = TICKET_NON_ADMIN_STATUS_CHANGE_NOTIFICATION[status];
      const isNonAdminStatusChange = !isAdmin(actor.role) && notificationData !== null;

      if (isNonAdminStatusChange) {
        const isSpecialistActor = isSpecialist(notificationData.actorRole);
        const isSpecialistRecipient = isSpecialist(notificationData.recipientRole);

        if (!specialist && (isSpecialistActor || isSpecialistRecipient)) return;

        NotificationManager.createNotification(
          {
            type: notificationData.notificationType,
            actor: isSpecialistActor ? specialist : ticketCreator,
            ticketId: ticket._id.toString(),
          },
          isSpecialistRecipient ? specialist : ticketCreator,
        );
      } else {
        const recipients = [ticketCreator];

        if (specialist) recipients.push(specialist);

        await Promise.all(
          recipients.map((recipient) =>
            NotificationManager.createNotification(
              {
                actor,
                type: ENotificationType.ADMIN_TICKET_STATUS_UPDATED,
                ticketId: ticket._id.toString(),
              },
              recipient,
            ),
          ),
        );
      }
    }
  },
};
