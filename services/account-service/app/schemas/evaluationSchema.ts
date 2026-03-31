import { Schema, Types } from 'mongoose';
import { ESupportedCurrency } from 'shared-types';

export interface IEvaluationSchema extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  dateOfResponse: Date;
  minutes: number;
  price: {
    amountInCents: number;
    currency: ESupportedCurrency;
  };
}

const evaluationSchema = new Schema<IEvaluationSchema>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateOfResponse: {
      type: Date,
      required: true,
    },
    minutes: { type: Number, required: true, default: 0 },
    price: {
      amountInCents: { type: Number, required: true },
      currency: { type: String, enum: ESupportedCurrency, required: true },
    },
  },
  {
    _id: true,
  },
);

export default evaluationSchema;
