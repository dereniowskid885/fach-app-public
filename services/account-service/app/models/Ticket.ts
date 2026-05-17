import { Types, Document, Schema, model } from 'mongoose';
import { ICategoryModel } from './Category';
import { IUserModel } from './User';
import EvaluationSchema, { IEvaluationSchema } from '@schemas/evaluationSchema';
import { ETicketStatus } from 'shared-types';
import { IPaymentModel } from './Payment';

export interface ITicketModel extends Document {
  _id: Types.ObjectId;
  category: Types.ObjectId | ICategoryModel;
  city: string;
  status: ETicketStatus;
  assignee: Types.ObjectId | IUserModel | null;
  createdBy: Types.ObjectId | IUserModel;
  createdAt: Date;
  updatedBy: Types.ObjectId | IUserModel;
  updatedAt: Date;
  title: string;
  description: string;
  evaluations: IEvaluationSchema[];
  acceptedEvaluation: IEvaluationSchema | null;
  commentsCount: number;
  specialistCommentsCount: number;
  payment: Types.ObjectId | IPaymentModel;
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
      required: false,
      default: null,
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
    acceptedEvaluation: {
      type: EvaluationSchema,
      default: null,
    },
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
    payment: {
      type: Types.ObjectId,
      ref: 'Payment',
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

export default model('Ticket', ticketSchema);
