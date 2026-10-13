import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT Token with 7 days expiration
const generateToken = (id, role = 'user', accountType = 'renter') => {
  return jwt.sign(
    { id, role, accountType },
    process.env.JWT_SECRET || 'farmshare_ai_secure_jwt_token_key_2026_growth',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, accountType, location, bio } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Full Name, Email, Phone Number, and Password.'
      });
    }

    if (!accountType || !['owner', 'renter'].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: 'Please select either Farmer / Renter or Equipment Owner.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists. Please log in.'
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      accountType,
      role: 'user',
      bio: bio || undefined,
      location: location || '',
      isActive: true,
      lastLogin: new Date()
    });

    if (user) {
      const token = generateToken(user._id, user.role, user.accountType);

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          accountType: user.accountType,
          role: user.role,
          location: user.location,
          profileImage: user.profileImage,
          bio: user.bio,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user registration data.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, accountType } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    if (!accountType || !['owner', 'renter'].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: 'Please select your account type (Farmer / Renter or Equipment Owner).'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user and explicitly select password
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'This account is currently deactivated. Please contact support.'
      });
    }

    // Validate Account Type matches the account's registered accountType
    if (user.accountType !== accountType) {
      return res.status(400).json({
        success: false,
        message: 'Selected account type does not match your account.'
      });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, user.accountType);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        role: user.role,
        location: user.location,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        role: user.role,
        location: user.location,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
