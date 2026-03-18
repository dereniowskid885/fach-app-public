import { Types, Document, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { EUserRole } from '@shared/enums/role';
import { EThemeType } from '@shared/enums/theme';
import { ISafeUserObject } from '@interfaces/user';

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
  theme: EThemeType;
}

interface IUserDocument extends Document {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  toSafeObject: () => ISafeUserObject;
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
    theme: {
      type: String,
      enum: [EThemeType.DARK, EThemeType.LIGHT, EThemeType.SYSTEM],
      default: EThemeType.SYSTEM,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT ?? ''));
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  const result = await bcrypt.compare(candidatePassword, this.password);

  return result;
};

userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    email: this.email,
    role: this.role,
    name: this.name,
    surname: this.surname,
    category: this.category,
    city: this.city,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default model('User', userSchema);
