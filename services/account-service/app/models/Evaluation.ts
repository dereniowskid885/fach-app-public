import { ESupportedCurrency } from '@shared/constants/enums';
import { model, Types, Schema } from 'mongoose';

export interface IEvaluationModel extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  dateOfResponse: Date;
  price: {
    value: number;
    currency: ESupportedCurrency;
  };
}

const evaluationSchema = new Schema<IEvaluationModel>({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  dateOfResponse: {
    type: Date,
    required: true,
  },
  price: {
    value: { type: Number, required: true },
    currency: { type: String, enum: [ESupportedCurrency.PLN], required: true },
  },
});

export default model('Evaluation', evaluationSchema);
