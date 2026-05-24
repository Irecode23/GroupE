const express = require('express');
const router = express.Router();
const {
  bookRide,
  getAvailableRides,
  requestRide,
  acceptDriver,
  updateRideStatus,
  confirmRide,
  getMyRides,
  getAllRides
} = require('../controllers/rideController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/book', protect, bookRide);
router.get('/available', protect, getAvailableRides);
router.get('/my-rides', protect, getMyRides);
router.put('/request/:id', protect, requestRide);
router.put('/accept-driver/:id', protect, acceptDriver);
router.put('/status/:id', protect, updateRideStatus);
router.put('/confirm/:id', protect, confirmRide);
router.get('/all', protect, adminOnly, getAllRides);

module.exports = router;