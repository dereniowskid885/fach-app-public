import { Types, Document, model, Schema } from 'mongoose';
import Ticket from './Ticket';

export interface ICategoryModel extends Document {
  _id: Types.ObjectId;
  name: string;
  specialists: Types.ObjectId[];
}

const categorySchema = new Schema<ICategoryModel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  specialists: [{ type: Types.ObjectId, ref: 'User' }],
});

categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const categoryId = this._id;
  await Ticket.deleteMany({ category: categoryId });
  next();
});

export default model('Category', categorySchema);
