import { ETicketStatus } from '@shared/constants/enums';
import { Types, Document, Schema, model } from 'mongoose';

export interface ITicketModel extends Document {
  _id: Types.ObjectId;
  category: Types.ObjectId;
  city: string;
  status: ETicketStatus;
  assignee: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedBy: Types.ObjectId;
  updatedAt: Date;
  title: string;
  description: string;
  evaluations: Types.ObjectId[];
  acceptedEvaluation: Types.ObjectId;
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
    enum: [
      ETicketStatus.PRICE_EVALUATION,
      ETicketStatus.PRICE_USER_ACCEPTATION,
      ETicketStatus.PENDING_PAYMENT,
      ETicketStatus.IN_PROGRESS,
      ETicketStatus.SOLUTION_USER_APPROVAL,
      ETicketStatus.MODERATOR_INVESTIGATION,
      ETicketStatus.COMPLETED,
    ],
    required: false,
    default: ETicketStatus.PRICE_EVALUATION,
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
  evaluations: [{ type: Types.ObjectId, ref: 'Evaluation' }],
  acceptedEvaluation: {
    type: Types.ObjectId,
    ref: 'Evaluation',
  },
});

export default model('Ticket', ticketSchema);
