import { Types, Document, model, Schema } from 'mongoose';
import Ticket from './Ticket';
import { IUserModel } from './User';

export interface ICategoryModel extends Document {
  _id: Types.ObjectId;
  name: string;
  specialists: Types.ObjectId[];
  createdAt: Date;
  updatedBy: Types.ObjectId | IUserModel;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    specialists: [{ type: Types.ObjectId, ref: 'User' }],
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const categoryId = this._id;
  await Ticket.deleteMany({ category: categoryId });
  next();
});

export default model('Category', categorySchema);
