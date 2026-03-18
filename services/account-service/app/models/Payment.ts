import { EPaymentStatus } from '@shared/enums/payment';
import { ESupportedCurrency } from '@shared/enums/currency';
import { model, Schema, Types } from 'mongoose';

export interface IPaymentModel extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  ticket: Types.ObjectId;
  amount: number;
  currency: ESupportedCurrency;
  paymentMethod: string;
  status: EPaymentStatus;
  createdAt: Date;
}

const paymentSchema = new Schema<IPaymentModel>({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticket: {
    type: Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: { type: String, enum: [ESupportedCurrency.PLN], required: true },
  paymentMethod: {
    type: String,
    required: true,
    default: 'BLIK',
  },
  status: {
    type: String,
    enum: [EPaymentStatus.PENDING],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export default model('Payment', paymentSchema);
