const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    default: 0
  },
  driverEarning: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionRef: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);