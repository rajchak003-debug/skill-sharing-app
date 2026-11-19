import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, skillsWanted } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      skillsWanted: skillsWanted || []
    });

    if (user) {
      res.status(201).json({
        status: 'success',
        token: generateToken(user._id),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          skillsWanted: user.skillsWanted,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        status: 'success',
        token: generateToken(user._id),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          skillsWanted: user.skillsWanted,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    if (req.body.skillsWanted !== undefined) {
      user.skillsWanted = Array.isArray(req.body.skillsWanted)
        ? req.body.skillsWanted
        : req.body.skillsWanted.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        skillsWanted: updatedUser.skillsWanted,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};