import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/auth.js';
import { emitTaskEvent } from '../config/socket.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation
} from '../middleware/validators.js';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authMiddleware);

/**
 * GET /api/tasks
 * Fetch all tasks for the authenticated user
 */
router.get('/', asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id })
    .sort({ createdAt: -1 }); // Sort by newest first

  res.json({
    tasks,
    count: tasks.length
  });
}));

/**
 * POST /api/tasks
 * Create a new task for the authenticated user
 */
router.post('/', createTaskValidation, asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  // Create new task with user association
  const task = new Task({
    userId: req.user.id,
    title: title.trim(),
    description: description?.trim() || '',
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null
  });

  await task.save();

  // Emit real-time event to connected clients
  const io = req.app.locals.io;
  if (io) {
    emitTaskEvent(io, req.user.id, 'task:created', { task });
  }

  res.status(201).json({
    message: 'Task created successfully',
    task
  });
}));

/**
 * GET /api/tasks/:id
 * Fetch a specific task with ownership verification
 */
router.get('/:id', taskIdValidation, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
  }

  // Verify ownership
  if (task.userId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You do not own this task.', 'FORBIDDEN');
  }

  res.json({ task });
}));

/**
 * PUT /api/tasks/:id
 * Update a task with ownership verification
 */
router.put('/:id', updateTaskValidation, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
  }

  // Verify ownership
  if (task.userId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You do not own this task.', 'FORBIDDEN');
  }

  // Update fields if provided
  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description.trim();
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  // Emit real-time event to connected clients
  const io = req.app.locals.io;
  if (io) {
    emitTaskEvent(io, req.user.id, 'task:updated', { task });
  }

  res.json({
    message: 'Task updated successfully',
    task
  });
}));

/**
 * DELETE /api/tasks/:id
 * Delete a task with ownership verification
 */
router.delete('/:id', taskIdValidation, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(404, 'Task not found', 'TASK_NOT_FOUND');
  }

  // Verify ownership
  if (task.userId.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied. You do not own this task.', 'FORBIDDEN');
  }

  await task.deleteOne();

  // Emit real-time event to connected clients
  const io = req.app.locals.io;
  if (io) {
    emitTaskEvent(io, req.user.id, 'task:deleted', { taskId: id });
  }

  res.json({
    message: 'Task deleted successfully',
    taskId: id
  });
}));

export default router;
