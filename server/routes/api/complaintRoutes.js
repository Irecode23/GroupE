const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
} = require('../../controllers/api/complaintController');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

router.post('/', protect, submitComplaint);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/all', protect, adminOnly, getAllComplaints);
router.put('/:id', protect, adminOnly, updateComplaintStatus);
router.delete('/:id', protect, adminOnly, deleteComplaint);

module.exports = router;