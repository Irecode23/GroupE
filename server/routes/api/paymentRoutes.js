const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentStats,
  getMyPayments
} = require('../../controllers/api/paymentController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

router.post('/', protect, createPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/all', protect, adminOnly, getAllPayments);
router.get('/stats', protect, adminOnly, getPaymentStats);

module.exports = router;