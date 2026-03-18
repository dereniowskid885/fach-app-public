import { ESupportedCurrency } from '@shared/enums/currency';
import { Schema, Types } from 'mongoose';

export interface IEvaluationSchema extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  dateOfResponse: Date;
  price: {
    amountInCents: number;
    currency: ESupportedCurrency;
  };
}

const evaluationSchema = new Schema<IEvaluationSchema>(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    dateOfResponse: {
      type: Date,
      required: true,
    },
    price: {
      amountInCents: { type: Number, required: true },
      currency: { type: String, enum: [ESupportedCurrency.PLN], required: true },
    },
  },
  {
    _id: true,
  },
);

export default evaluationSchema;
