const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
    },
    description: {
      type: String,
      default: '',
    },
    due_date: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property for dynamic overdue flagging (Task 33)
taskSchema.virtual('isOverdue').get(function () {
  if (this.status === 'done' || !this.due_date) return false;
  return new Date() > this.due_date;
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
