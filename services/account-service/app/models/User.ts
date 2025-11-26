import { Types, Document, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { EUserRole } from '@shared/constants/enums';
import { CategoryManager } from '@managers/categoryManager';

export interface IUserModel extends IUserDocument {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: EUserRole;
  category?: Types.ObjectId;
  name: string;
  surname: string;
  city?: string;
  refreshTokens: {
    token: string;
    deviceInfo: string;
    expiresAt: Date;
    createdAt: Date;
  }[];
  isVerified: boolean;
}

interface IUserDocument extends Document {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      maxlength: 48,
      minlength: 7,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 64,
    },
    role: {
      type: String,
      enum: [EUserRole.USER, EUserRole.SPECIALIST, EUserRole.ADMIN],
      default: EUserRole.USER,
    },
    category: { type: Types.ObjectId, ref: 'Category' },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    surname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
    },
    city: {
      type: String,
      required: false,
      minlength: 3,
      maxlength: 64,
    },
    refreshTokens: [
      {
        token: String,
        deviceInfo: String,
        expiresAt: Date,
        createdAt: Date,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT ?? ''));
  next();
});

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  if (this.role !== EUserRole.SPECIALIST) {
    next();
  }

  // remove specialist from category
  if (this.category) {
    const category = await CategoryManager.getCategoryById(this.category.id.toString());

    const indexToRemove = category.specialists.findIndex((id) => id.equals(this._id));
    const userIdFound = indexToRemove !== -1;

    if (userIdFound && category.specialists.length === 1) {
      await category.deleteOne();
      next();
    }

    if (userIdFound) {
      category.specialists.splice(indexToRemove, 1);
      await category.save();
    }
  }

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  const result = await bcrypt.compare(candidatePassword, this.password);

  return result;
};

export default model('User', userSchema);
