const User = require('../../models/User');
const Ride = require('../../models/Ride');
const Payment = require('../../models/Payment');
const Complaint = require('../../models/Complaint');
const Rating = require('../../models/Rating');

// Generate full report (admin)
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [users, rides, payments, complaints, ratings] = await Promise.all([
      User.find({ role: { $ne: 'admin' }, ...dateFilter }).select('-password'),
      Ride.find(dateFilter)
        .populate('rider', 'name email')
        .populate('driver', 'name email'),
      Payment.find({ status: 'completed', ...dateFilter }),
      Complaint.find(dateFilter).populate('submittedBy', 'name email role'),
      Rating.find(dateFilter).populate('ratedBy', 'name').populate('ratedUser', 'name')
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = payments.reduce((sum, p) => sum + p.commission, 0);

    const report = {
      generatedAt: new Date(),
      period: { startDate, endDate },
      summary: {
        totalUsers: users.length,
        totalRiders: users.filter(u => u.role === 'rider').length,
        totalDrivers: users.filter(u => u.role === 'driver').length,
        verifiedUsers: users.filter(u => u.isVerified).length,
        pendingUsers: users.filter(u => !u.isVerified).length,
        totalRides: rides.length,
        completedRides: rides.filter(r => r.status === 'completed').length,
        cancelledRides: rides.filter(r => r.status === 'cancelled').length,
        pendingRides: rides.filter(r => r.status === 'pending').length,
        totalRevenue,
        totalCommission,
        totalTransactions: payments.length,
        totalComplaints: complaints.length,
        resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
        openComplaints: complaints.filter(c => c.status === 'open').length,
        totalRatings: ratings.length,
        averageRating: ratings.length > 0
          ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
          : 0
      },
      users,
      rides,
      payments,
      complaints,
      ratings
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user report
exports.getUserReport = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    const riders = users.filter(u => u.role === 'rider');
    const drivers = users.filter(u => u.role === 'driver');
    const verified = users.filter(u => u.isVerified);
    const pending = users.filter(u => !u.isVerified);

    res.status(200).json({
      total: users.length,
      riders: riders.length,
      drivers: drivers.length,
      verified: verified.length,
      pending: pending.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ride report
exports.getRideReport = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('rider', 'name email')
      .populate('driver', 'name email')
      .sort({ createdAt: -1 });

    const completed = rides.filter(r => r.status === 'completed');
    const cancelled = rides.filter(r => r.status === 'cancelled');
    const pending = rides.filter(r => r.status === 'pending');
    const ongoing = rides.filter(r => r.status === 'ongoing');

    res.status(200).json({
      total: rides.length,
      completed: completed.length,
      cancelled: cancelled.length,
      pending: pending.length,
      ongoing: ongoing.length,
      totalFare: rides.reduce((sum, r) => sum + r.fare, 0),
      rides
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};