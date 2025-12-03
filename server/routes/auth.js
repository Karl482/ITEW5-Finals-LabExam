import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { registerValidation, loginValidation } from '../middleware/validators.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with username, email, and password
 * @access  Public
 */
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists with username
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(409, 'Username already exists', 'DUPLICATE_USERNAME');
  }

  // Check if user already exists with email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, 'Email already exists', 'DUPLICATE_EMAIL');
  }

  // Create new user
  const user = new User({
    username,
    email,
    password,
    authProvider: 'local',
    displayName: username // Default display name to username
  });

  // Save user to database (password will be hashed by pre-save middleware)
  await user.save();

  // Generate JWT token
  const token = generateToken(user);

  // Return success response with token and user info
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      authProvider: user.authProvider,
      avatar: user.avatar
    }
  });
}));

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with username/email and password
 * @access  Public
 */
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Find user by username or email
  const query = username ? { username } : { email };
  const user = await User.findOne(query);

  // Check if user exists
  if (!user) {
    throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  // Check if user is using local authentication
  if (user.authProvider !== 'local') {
    throw new ApiError(
      401,
      `This account uses ${user.authProvider} authentication. Please login with ${user.authProvider}.`,
      'WRONG_AUTH_PROVIDER'
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  // Generate JWT token
  const token = generateToken(user);

  // Return success response with token and user info
  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      authProvider: user.authProvider,
      avatar: user.avatar
    }
  });
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 */
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user
  });
}));

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`
  }),
  asyncHandler(async (req, res) => {
    // User is authenticated via Passport, available in req.user
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
    }

    // Generate JWT token for the authenticated user
    const token = generateToken(user);

    // Redirect to frontend with token
    // Frontend will extract token from URL and store it
    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  })
);

export default router;
