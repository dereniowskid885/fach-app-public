import { Types, Document, Schema, model } from 'mongoose';
import { ICategoryModel } from './Category';
import { IUserModel } from './User';
import EvaluationSchema, { IEvaluationSchema } from '@schemas/evaluationSchema';
import { ETicketStatus } from 'shared-types';

export interface ITicketModel extends Document {
  _id: Types.ObjectId;
  category: Types.ObjectId | ICategoryModel;
  city: string;
  status: ETicketStatus;
  assignee: Types.ObjectId | IUserModel;
  createdBy: Types.ObjectId | IUserModel;
  createdAt: Date;
  updatedBy: Types.ObjectId | IUserModel;
  updatedAt: Date;
  title: string;
  description: string;
  evaluations: IEvaluationSchema[];
  acceptedEvaluation: IEvaluationSchema;
  commentsCount: number;
  specialistCommentsCount: number;
}

const ticketSchema = new Schema<ITicketModel>(
  {
    category: {
      type: Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ETicketStatus,
      required: false,
      default: ETicketStatus.AWAITING_EVALUATION,
    },
    assignee: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      default: (ticket: ITicketModel) => {
        return ticket.createdBy;
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    evaluations: [EvaluationSchema],
    acceptedEvaluation: EvaluationSchema,
    commentsCount: {
      type: Number,
      required: false,
      default: 0,
    },
    specialistCommentsCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true },
);

export default model('Ticket', ticketSchema);
