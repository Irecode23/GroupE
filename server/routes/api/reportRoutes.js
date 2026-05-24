const express = require('express');
const router = express.Router();
const {
  generateReport,
  getUserReport,
  getRideReport
} = require('../../controllers/api/reportController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

router.get('/generate', protect, adminOnly, generateReport);
router.get('/users', protect, adminOnly, getUserReport);
router.get('/rides', protect, adminOnly, getRideReport);

module.exports = router;