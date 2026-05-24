const express = require('express');
const router = express.Router();
const {
  submitRating,
  getUserRatings,
  getAllRatings,
  flagRating,
  deleteRating
} = require('../../controllers/api/ratingController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

router.post('/', protect, submitRating);
router.get('/user/:userId', protect, getUserRatings);
router.get('/all', protect, adminOnly, getAllRatings);
router.put('/flag/:id', protect, adminOnly, flagRating);
router.delete('/:id', protect, adminOnly, deleteRating);

module.exports = router;