# Backend Error Handling and Validation

This document describes the centralized error handling and validation system implemented in the Sports PWA Task Manager API.

## Overview

The backend now uses a centralized error handling system with consistent error response formats and comprehensive request validation using `express-validator`.

## Components

### 1. Error Handler Middleware (`middleware/errorHandler.js`)

#### ApiError Class
Custom error class for creating operational errors with specific status codes and error codes.

```javascript
throw new ApiError(statusCode, message, code, details);
```

**Example:**
```javascript
throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
```

#### errorHandler Middleware
Centralized error handling middleware that:
- Handles all errors thrown in the application
- Provides consistent error response format
- Handles Mongoose validation errors
- Handles Mongoose duplicate key errors
- Handles JWT errors (invalid token, expired token)
- Logs errors appropriately based on environment

#### notFoundHandler Middleware
Handles 404 errors for routes that don't exist.

#### asyncHandler Wrapper
Wraps async route handlers to automatically catch errors and pass them to the error handler.

**Usage:**
```javascript
router.get('/tasks', asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json({ tasks });
}));
```

### 2. Validation Middleware (`middleware/validators.js`)

Provides validation rules for all API endpoints using `express-validator`.

#### Available Validators

- **registerValidation**: Validates user registration
  - Username: 3-30 characters, alphanumeric with underscores/hyphens
  - Email: Valid email format
  - Password: Min 6 characters, must contain uppercase, lowercase, and number

- **loginValidation**: Validates user login
  - Requires either username or email
  - Password is required

- **createTaskValidation**: Validates task creation
  - Title: Required, 1-200 characters
  - Description: Optional, max 1000 characters
  - Status: Optional, must be 'todo', 'in-progress', or 'completed'
  - Priority: Optional, must be 'low', 'medium', or 'high'
  - Due date: Optional, must be valid ISO 8601 date, cannot be in the past

- **updateTaskValidation**: Validates task updates
  - Task ID: Must be valid MongoDB ObjectId
  - Same field validations as createTaskValidation (all optional)

- **taskIdValidation**: Validates MongoDB ObjectId format

#### Usage Example

```javascript
import { createTaskValidation, asyncHandler } from '../middleware/errorHandler.js';

router.post('/tasks', createTaskValidation, asyncHandler(async (req, res) => {
  // Validation passed, create task
  const task = new Task(req.body);
  await task.save();
  res.status(201).json({ task });
}));
```

## Error Response Format

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {
      "field": "Field-specific error message"
    },
    "stack": "Stack trace (development only)"
  }
}
```

## HTTP Status Codes

The API uses appropriate HTTP status codes:

- **200 OK**: Successful GET request
- **201 Created**: Successful POST request (resource created)
- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource (e.g., username exists)
- **500 Internal Server Error**: Unexpected server errors

## Error Codes

Common error codes used in the API:

### Authentication Errors
- `NO_TOKEN`: No authentication token provided
- `INVALID_AUTH_FORMAT`: Invalid authorization header format
- `EMPTY_TOKEN`: Token is empty
- `INVALID_TOKEN`: Token is invalid
- `TOKEN_EXPIRED`: Token has expired
- `USER_NOT_FOUND`: User not found for token
- `INVALID_CREDENTIALS`: Invalid login credentials
- `WRONG_AUTH_PROVIDER`: User registered with different auth provider

### Validation Errors
- `VALIDATION_ERROR`: Request validation failed
- `DUPLICATE_USERNAME`: Username already exists
- `DUPLICATE_EMAIL`: Email already exists
- `DUPLICATE_FIELD`: Generic duplicate field error

### Task Errors
- `TASK_NOT_FOUND`: Task not found
- `INVALID_ID`: Invalid MongoDB ObjectId format
- `FORBIDDEN`: User doesn't own the resource

### General Errors
- `NOT_FOUND`: Route not found
- `INTERNAL_ERROR`: Unexpected server error

## Testing

Run the validation tests:

```bash
node test-validation.js
```

This will test:
- Invalid registration data (short username, weak password, invalid email)
- Missing required fields
- Unauthorized access
- Invalid task data
- Invalid MongoDB ObjectId format
- 404 errors
- Valid registration and task creation

## Best Practices

1. **Always use asyncHandler** for async route handlers
2. **Throw ApiError** for operational errors with appropriate status codes
3. **Use validation middleware** before route handlers
4. **Don't catch errors** in route handlers - let them bubble up to the error handler
5. **Use specific error codes** for different error types
6. **Provide helpful error messages** for users

## Example: Complete Route Implementation

```javascript
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createTaskValidation } from '../middleware/validators.js';

router.post('/tasks', 
  authMiddleware,           // Check authentication
  createTaskValidation,     // Validate request body
  asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    
    // Create task
    const task = new Task({
      userId: req.user.id,
      title,
      description
    });
    
    await task.save();
    
    // Emit real-time event
    emitTaskEvent(io, req.user.id, 'task:created', { task });
    
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  })
);
```

## Environment-Specific Behavior

### Development Mode
- Full error stack traces included in responses
- Detailed error logging to console
- All errors logged

### Production Mode
- No stack traces in responses
- Only operational errors logged
- Sensitive information sanitized
