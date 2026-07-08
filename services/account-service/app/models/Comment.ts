import { Types, Document, Schema, model } from 'mongoose';
import { EUserRole } from 'shared-types';
import { IUserModel } from './User';
import Ticket, { ITicketModel } from './Ticket';

export interface ICommentModel extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUserModel;
  userRole: EUserRole;
  ticket: Types.ObjectId | ITicketModel;
  content: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<ICommentModel>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userRole: {
      type: String,
      enum: EUserRole,
    },
    ticket: {
      type: Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true },
);

commentSchema.post('save', async function () {
  await Ticket.findByIdAndUpdate(this.ticket, {
    $inc: {
      // update all comments counter
      commentsCount: 1,
      // update specialist comments counter
      ...(this.userRole === EUserRole.SPECIALIST && { specialistCommentsCount: 1 }),
    },
  });
});

commentSchema.pre('deleteOne', { document: true, query: false }, async function () {
  await Ticket.findByIdAndUpdate(this.ticket, {
    $inc: {
      // update all comments counter
      commentsCount: -1,
      // update specialist comments counter
      ...(this.userRole === EUserRole.SPECIALIST && { specialistCommentsCount: -1 }),
    },
  });
});

export default model('Comment', commentSchema);
