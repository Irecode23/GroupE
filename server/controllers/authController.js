const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, adminCode } = req.body;

    if (role === 'admin') {
      if (adminCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ message: 'Invalid admin secret code' });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      isVerified: role === 'admin' ? true : false
    });

    if (role === 'admin') {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token
      });
    }

    res.status(201).json({
      message: 'Registration successful! Please wait for admin verification.'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin' && !user.isVerified) {
      return res.status(403).json({
        message: 'Your account is pending admin verification. Please wait for approval.'
      });
    }

    // Admin gets no expiry, users get 10 years
    const token = user.role === 'admin'
      ? jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      : jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3650d' })

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};