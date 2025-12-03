import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { ApiError } from './errorHandler.js';

/**
 * Authentication middleware to verify JWT tokens
 * Extracts token from Authorization header, verifies it, and attaches user to request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, 'Authentication required. No token provided.', 'NO_TOKEN');
    }

    // Check if the header follows the "Bearer <token>" format
    if (!authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Invalid authorization header format. Use "Bearer <token>".', 'INVALID_AUTH_FORMAT');
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      throw new ApiError(401, 'Authentication required. Token is empty.', 'EMPTY_TOKEN');
    }

    // Verify the token (will throw JsonWebTokenError or TokenExpiredError if invalid)
    const decoded = verifyToken(token);

    // Fetch user from database to ensure user still exists
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'User not found. Token may be invalid.', 'USER_NOT_FOUND');
    }

    // Attach user information to request object
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      authProvider: user.authProvider,
      avatar: user.avatar
    };

    // Attach the full user document if needed
    req.userDoc = user;

    next();
  } catch (error) {
    // Pass error to centralized error handler
    next(error);
  }
};
