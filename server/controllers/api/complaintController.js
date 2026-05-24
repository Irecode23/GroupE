const Complaint = require('../../models/Complaint');
const Notification = require('../../models/Notification');

// Submit a complaint (rider or driver)
exports.submitComplaint = async (req, res) => {
  try {
    const { category, subject, description, againstUser, ride } = req.body;

    const complaint = await Complaint.create({
      submittedBy: req.user._id,
      againstUser: againstUser || null,
      ride: ride || null,
      category,
      subject,
      description
    });

    // Notify admin
    await Notification.create({
      user: req.user._id,
      title: 'New Complaint Submitted',
      message: `A new complaint has been submitted: ${subject}`,
      type: 'complaint'
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my complaints (rider or driver)
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ submittedBy: req.user._id })
      .populate('againstUser', 'name email')
      .populate('ride', 'pickupLocation dropoffLocation')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all complaints (admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy', 'name email role')
      .populate('againstUser', 'name email role')
      .populate('ride', 'pickupLocation dropoffLocation fare')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update complaint status (admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    if (adminResponse) complaint.adminResponse = adminResponse;
    if (status === 'resolved') complaint.resolvedAt = new Date();

    await complaint.save();

    // Notify user
    await Notification.create({
      user: complaint.submittedBy,
      title: 'Complaint Update',
      message: `Your complaint "${complaint.subject}" has been ${status}.`,
      type: 'complaint'
    });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete complaint (admin)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    await complaint.deleteOne();
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};