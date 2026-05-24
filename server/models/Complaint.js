const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  againstUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    default: null
  },
  category: {
    type: String,
    enum: ['driver_behavior', 'rider_behavior', 'payment_issue', 'app_issue', 'safety_concern', 'other'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved', 'dismissed'],
    default: 'open'
  },
  adminResponse: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);