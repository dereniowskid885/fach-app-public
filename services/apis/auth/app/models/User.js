const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const userSchema = new mongoose.Schema(
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
      enum: ['user', 'specialist', 'admin'],
      default: 'user',
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
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
  this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT));
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const user = this;

  if (user.role !== 'specialist') {
    next();
  }

  // remove specialist from category
  if (user.category) {
    try {
      await axios.patch(`${process.env.TICKETING_SERVICE_BASE_URL}/api/categories/${user.category}/specialist/remove`, {
        userId: user._id,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Error occured while removing specialist from category',
        error: err.message,
      });
    }
  }

  next();
});

module.exports = mongoose.model('User', userSchema);
