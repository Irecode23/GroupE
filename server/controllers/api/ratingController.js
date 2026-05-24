const Rating = require('../../models/Rating');
const User = require('../../models/User');
const Ride = require('../../models/Ride');

// Submit a rating
exports.submitRating = async (req, res) => {
  try {
    const { ride, ratedUser, rating, review } = req.body;

    const existingRating = await Rating.findOne({
      ride,
      ratedBy: req.user._id
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this ride' });
    }

    const newRating = await Rating.create({
      ride,
      ratedBy: req.user._id,
      ratedUser,
      rating,
      review
    });

    // Update user average rating
    const ratings = await Rating.find({ ratedUser });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await User.findByIdAndUpdate(ratedUser, { rating: avgRating.toFixed(1) });

    // Mark ride as rated
    await Ride.findByIdAndUpdate(ride, { isRated: true });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ratings for a user
exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate('ratedBy', 'name role')
      .populate('ride', 'pickupLocation dropoffLocation')
      .sort({ createdAt: -1 });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all ratings (admin)
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate('ratedBy', 'name email role')
      .populate('ratedUser', 'name email role')
      .populate('ride', 'pickupLocation dropoffLocation')
      .sort({ createdAt: -1 });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Flag a rating (admin)
exports.flagRating = async (req, res) => {
  try {
    const { flagReason } = req.body;
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    rating.isFlagged = true;
    rating.flagReason = flagReason;
    await rating.save();

    res.status(200).json({ message: 'Rating flagged successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a rating (admin)
exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    await rating.deleteOne();
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};