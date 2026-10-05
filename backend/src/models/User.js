const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      unique: true,
      trim: true,
      index: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'inspector', 'admin'],
        message: '{VALUE} is not a valid role'
      },
      default: 'student',
      required: true
    },
    assignedHalls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiningHall'
      }
    ],
    badgeNumber: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
