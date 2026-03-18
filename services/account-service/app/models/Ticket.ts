import { ETicketStatus } from '@shared/constants/enums';
import { Types, Document, Schema, model } from 'mongoose';
import { ICategoryModel } from './Category';
import { IUserModel } from './User';
import EvaluationSchema, { IEvaluationSchema } from '@schemas/evaluationSchema';

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
}

const ticketSchema = new Schema<ITicketModel>({
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
    enum: [...Object.values(ETicketStatus)],
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
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updatedBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    default: (ticket: ITicketModel) => {
      return ticket.createdBy;
    },
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(),
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
});

export default model('Ticket', ticketSchema);
