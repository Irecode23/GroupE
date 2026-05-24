const Ride = require('../models/Ride');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// Book a ride (rider)
exports.bookRide = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation } = req.body;

    const ride = await Ride.create({
      rider: req.user._id,
      pickupLocation,
      dropoffLocation,
      fare: Math.floor(Math.random() * 1000) + 500
    });

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all available rides (driver)
exports.getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'pending' })
      .populate('rider', 'name phone')
      .populate('driverRequests.driver', 'name phone rating');
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Driver requests a ride
exports.requestRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }

    // Check if driver already requested
    const alreadyRequested = ride.driverRequests.find(
      r => r.driver.toString() === req.user._id.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: 'You already requested this ride' });
    }

    ride.driverRequests.push({ driver: req.user._id });
    await ride.save();

    // Notify rider
    await Notification.create({
      user: ride.rider,
      title: 'Driver Request',
      message: 'A driver has requested your ride. Check your dashboard to accept.',
      type: 'ride'
    });

    res.status(200).json({ message: 'Ride request sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rider accepts a driver
exports.acceptDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is no longer pending' });
    }

    // Check driver requested this ride
    const driverRequest = ride.driverRequests.find(
      r => r.driver.toString() === driverId
    );

    if (!driverRequest) {
      return res.status(400).json({ message: 'This driver did not request your ride' });
    }

    ride.driver = driverId;
    ride.status = 'accepted';
    await ride.save();

    // Notify accepted driver
    await Notification.create({
      user: driverId,
      title: 'Ride Accepted',
      message: 'Your ride request has been accepted by the rider!',
      type: 'ride'
    });

    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Driver updates ride status
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    ride.status = status;
    await ride.save();

    // Notify rider when driver marks completed
    if (status === 'driver_completed') {
      await Notification.create({
        user: ride.rider,
        title: 'Ride Completed',
        message: 'Your driver has marked the ride as completed. Please confirm and rate your experience.',
        type: 'ride'
      });
    }

    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rider confirms ride + auto creates payment
exports.confirmRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (ride.status !== 'driver_completed') {
      return res.status(400).json({ message: 'Ride is not yet completed by driver' });
    }

    ride.status = 'completed';
    ride.riderConfirmed = true;
    ride.paymentStatus = 'paid';
    await ride.save();

    // Auto create payment
    const commission = ride.fare * 0.1;
    const driverEarning = ride.fare - commission;

    await Payment.create({
      ride: ride._id,
      rider: ride.rider,
      driver: ride.driver,
      amount: ride.fare,
      commission,
      driverEarning,
      paymentMethod: 'cash',
      status: 'completed',
      transactionRef: 'TXN' + Date.now()
    });

    res.status(200).json({
      message: 'Ride confirmed successfully! Please rate your driver.',
      ride
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my rides (rider or driver)
exports.getMyRides = async (req, res) => {
  try {
    let rides;

    if (req.user.role === 'rider') {
      rides = await Ride.find({ rider: req.user._id })
        .populate('driver', 'name phone rating')
        .populate('driverRequests.driver', 'name phone rating')
        .sort({ createdAt: -1 });
    } else {
      rides = await Ride.find({
        $or: [
          { driver: req.user._id },
          { 'driverRequests.driver': req.user._id }
        ]
      })
        .populate('rider', 'name phone')
        .sort({ createdAt: -1 });
    }

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rides (admin)
exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('rider', 'name email')
      .populate('driver', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};