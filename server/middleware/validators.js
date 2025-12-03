import { body, param, validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';

/**
 * Middleware to check validation results
 * If validation fails, throw an ApiError with details
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = {};
    errors.array().forEach(error => {
      errorDetails[error.path] = error.msg;
    });

    throw new ApiError(
      400,
      'Validation failed',
      'VALIDATION_ERROR',
      errorDetails
    );
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  validate
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('username')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Username cannot be empty'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  // Custom validation to ensure either username or email is provided
  body().custom((value, { req }) => {
    if (!req.body.username && !req.body.email) {
      throw new Error('Please provide either username or email');
    }
    return true;
  }),
  
  validate
];

/**
 * Validation rules for creating a task
 */
export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title must be between 1 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be one of: todo, in-progress, completed'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
    .custom((value) => {
      const date = new Date(value);
      if (date < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  
  validate
];

/**
 * Validation rules for updating a task
 */
export const updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title must be between 1 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed'])
    .withMessage('Status must be one of: todo, in-progress, completed'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  
  body('dueDate')
    .optional()
    .custom((value) => {
      if (value === null) return true; // Allow null to clear due date
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Due date must be a valid date');
      }
      return true;
    }),
  
  validate
];

/**
 * Validation rules for task ID parameter
 */
export const taskIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format'),
  
  validate
];
