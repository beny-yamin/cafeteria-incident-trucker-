const mongoose = require('mongoose');

const diningHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dining hall name is required'],
      trim: true
    },
    campus: {
      type: String,
      required: [true, 'Campus is required'],
      trim: true
    },
    supervisorName: {
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

const DiningHall = mongoose.model('DiningHall', diningHallSchema);

module.exports = DiningHall;
