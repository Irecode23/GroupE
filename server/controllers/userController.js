const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get my profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update my profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify user (admin)
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: `${user.name} has been verified successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unverify user (admin)
exports.unverifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: `${user.name} has been unverified` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend or activate user (admin)
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !user.isActive },
      { new: true }
    );
    res.status(200).json({
      message: `${updatedUser.name} has been ${updatedUser.isActive ? 'activated' : 'suspended'} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};