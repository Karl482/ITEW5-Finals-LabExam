import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'completed'],
        message: 'Status must be one of: todo, in-progress, completed'
      },
      default: 'todo',
      index: true
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be one of: low, medium, high'
      },
      default: 'medium'
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient user task queries with sorting
taskSchema.index({ userId: 1, createdAt: -1 });

// Compound index for filtering by user and status
taskSchema.index({ userId: 1, status: 1 });

// Method to return task object with formatted dates
taskSchema.methods.toJSON = function() {
  const taskObject = this.toObject();
  // Convert _id to id for consistency with frontend
  taskObject.id = taskObject._id;
  delete taskObject._id;
  delete taskObject.__v;
  return taskObject;
};

const Task = mongoose.model('Task', taskSchema);

export default Task;
