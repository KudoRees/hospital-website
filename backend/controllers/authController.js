const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ email, password, role });

    const parts = (name || email.split('@')[0]).trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || 'N/A';

    // Auto-create a Patient profile if registering as a patient
    if (role === 'patient') {
      const patientId = `PAT-${Math.floor(10000 + Math.random() * 90000)}`;
      
      await Patient.create({
        user: user._id,
        patientId,
        firstName,
        lastName,
        age: 0,
        gender: 'Other',
        contactNumber: '0000000000'
      });
    }

    // Auto-create a Doctor profile if registering as a doctor
    if (role === 'doctor') {
      await Doctor.create({
        user: user._id,
        firstName,
        lastName,
        specialization: 'General',
        contactNumber: '0000000000'
      });
    }

    res.status(201).json({
      _id: user.id, email: user.email, role: user.role, name: name,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id, email: user.email, role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Since there's no email service for local dev, return the reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    
    // Log it for admin visibility
    console.log(`Password reset URL for ${user.email}: ${resetUrl}`);

    res.status(200).json({ 
      success: true, 
      message: 'Password reset link generated successfully. Please use the provided link to reset your password.',
      resetUrl // Exposing for dev purposes
    });
  } catch (error) {
    res.status(500).json({ message: 'Email could not be sent' });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword };
