import { model, Schema, Types } from 'mongoose';
import { EPaymentStatus, ESupportedCurrency } from 'shared-types';

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

const paymentSchema = new Schema<IPaymentModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: { type: String, enum: ESupportedCurrency, required: true },
    paymentMethod: {
      type: String,
      required: true,
      default: 'BLIK',
    },
    status: {
      type: String,
      enum: EPaymentStatus,
      required: true,
    },
  },
  { timestamps: true },
);

export default model('Payment', paymentSchema);
