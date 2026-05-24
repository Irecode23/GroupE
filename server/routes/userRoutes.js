const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAllUsers,
  verifyUser,
  unverifyUser,
  suspendUser,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/all', protect, adminOnly, getAllUsers);
router.put('/verify/:id', protect, adminOnly, verifyUser);
router.put('/unverify/:id', protect, adminOnly, unverifyUser);
router.put('/suspend/:id', protect, adminOnly, suspendUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;