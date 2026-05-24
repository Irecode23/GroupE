const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  driverRequests: [
    {
      driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      requestedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  pickupLocation: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  dropoffLocation: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'driver_completed', 'completed', 'cancelled'],
    default: 'pending'
  },
  fare: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  riderConfirmed: {
    type: Boolean,
    default: false
  },
  isRated: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);