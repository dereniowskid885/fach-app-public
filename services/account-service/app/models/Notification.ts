import { Types, Document, Schema, model } from 'mongoose';
import { ENotificationType } from 'shared-types';
import { IUserModel } from './User';
import { ITicketModel } from './Ticket';

export interface INotificationModel extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId | IUserModel;
  actor: Types.ObjectId | IUserModel;
  type: ENotificationType;
  ticket: Types.ObjectId | ITicketModel;
  message: string;
}

const notificationSchema = new Schema<INotificationModel>(
  {
    recipient: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actor: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ENotificationType,
      required: true,
    },
    ticket: {
      type: Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default model('Notification', notificationSchema);
