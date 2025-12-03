/**
 * Custom Error Class for API errors
 */
export class ApiError extends Error {
  constructor(statusCode, message, code, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handling middleware
 * Handles all errors thrown in the application
 */
export const errorHandler = (err, req, res, next) => {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details || null;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = {};
    Object.keys(err.errors).forEach((key) => {
      details[key] = err.errors[key].message;
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_FIELD';
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      statusCode,
      code,
      message,
      details,
      stack: err.stack
    });
  } else {
    // In production, only log operational errors
    if (!err.isOperational) {
      console.error('Unexpected Error:', err);
    }
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      code,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Handle 404 Not Found errors
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    404,
    `Route ${req.originalUrl} not found`,
    'NOT_FOUND'
  );
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
