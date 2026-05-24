const Payment = require('../../models/Payment');
const Ride = require('../../models/Ride');

// Create payment when ride is completed
exports.createPayment = async (req, res) => {
  try {
    const { rideId, paymentMethod } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const existingPayment = await Payment.findOne({ ride: rideId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this ride' });
    }

    const commission = ride.fare * 0.1; // 10% commission
    const driverEarning = ride.fare - commission;

    const payment = await Payment.create({
      ride: rideId,
      rider: ride.rider,
      driver: ride.driver,
      amount: ride.fare,
      commission,
      driverEarning,
      paymentMethod: paymentMethod || 'cash',
      status: 'completed',
      transactionRef: `TXN${Date.now()}`
    });

    // Update ride payment status
    ride.paymentStatus = 'paid';
    await ride.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('rider', 'name email phone')
      .populate('driver', 'name email phone')
      .populate('ride', 'pickupLocation dropoffLocation')
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment stats (admin)
exports.getPaymentStats = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'completed' });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = payments.reduce((sum, p) => sum + p.commission, 0);
    const totalDriverEarnings = payments.reduce((sum, p) => sum + p.driverEarning, 0);

    const paymentMethods = {
      cash: payments.filter(p => p.paymentMethod === 'cash').length,
      card: payments.filter(p => p.paymentMethod === 'card').length,
      transfer: payments.filter(p => p.paymentMethod === 'transfer').length
    };

    res.status(200).json({
      totalRevenue,
      totalCommission,
      totalDriverEarnings,
      totalTransactions: payments.length,
      paymentMethods
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my payments (rider or driver)
exports.getMyPayments = async (req, res) => {
  try {
    let payments;
    if (req.user.role === 'rider') {
      payments = await Payment.find({ rider: req.user._id })
        .populate('driver', 'name phone')
        .populate('ride', 'pickupLocation dropoffLocation')
        .sort({ createdAt: -1 });
    } else {
      payments = await Payment.find({ driver: req.user._id })
        .populate('rider', 'name phone')
        .populate('ride', 'pickupLocation dropoffLocation')
        .sort({ createdAt: -1 });
    }
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};