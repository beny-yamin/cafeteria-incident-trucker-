const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiningHall',
      required: [true, 'Dining hall ID is required']
    },
    mealType: {
      type: String,
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner'],
        message: '{VALUE} is not a valid meal type'
      },
      required: [true, 'Meal type is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    severity: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: '{VALUE} is not a valid severity level'
      },
      default: 'Low',
      required: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['SUBMITTED', 'UNDER_REVIEW', 'ACTION_TAKEN', 'DISMISSED'],
        message: '{VALUE} is not a valid status'
      },
      default: 'SUBMITTED',
      required: true
    },
    assignedInspectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    inspectorNote: {
      type: String,
      trim: true,
      default: ''
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);

module.exports = IncidentReport;
