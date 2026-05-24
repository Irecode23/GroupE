const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'tricycle'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  totalRides: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);