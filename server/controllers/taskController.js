const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');

// Helper to check user membership and role in a project
const getMembership = async (projectId, userId) => {
  return await ProjectMember.findOne({ project_id: projectId, user_id: userId });
};

// @desc    Create a Task
// @route   POST /api/projects/:id/tasks
// @access  Private (Admin only)
const createTask = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { title, description, due_date, priority, status, assigned_to } = req.body;

    const membership = await getMembership(projectId, req.user.id);
    if (!membership || membership.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to create tasks in this project (Admin only)');
    }

    const task = await Task.create({
      title, description, due_date, priority, status, assigned_to,
      created_by: req.user.id,
      project_id: projectId
    });

    res.status(201).json(task);
  } catch (error) { next(error); }
};

// @desc    Get Project Tasks
// @route   GET /api/projects/:id/tasks
// @access  Private
const getProjectTasks = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const membership = await getMembership(projectId, req.user.id);
    if (!membership) {
      res.status(403);
      throw new Error('Not authorized to view tasks in this project');
    }

    const tasks = await Task.find({ project_id: projectId })
      .populate('assigned_to', 'name email')
      .populate('created_by', 'name email');
      
    res.status(200).json(tasks);
  } catch(error) { next(error); }
};

// @desc    Get Task Details
// @route   GET /api/tasks/:taskId
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('assigned_to', 'name email')
      .populate('created_by', 'name email');
      
    if (!task) { res.status(404); throw new Error('Task not found'); }

    const membership = await getMembership(task.project_id, req.user.id);
    if (!membership) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }

    res.status(200).json(task);
  } catch(error) { next(error); }
};

// @desc    Update Task
// @route   PATCH /api/tasks/:taskId
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) { res.status(404); throw new Error('Task not found'); }

    const membership = await getMembership(task.project_id, req.user.id);
    if (!membership) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const isAdmin = membership.role === 'admin';
    const isAssignee = task.assigned_to && task.assigned_to.toString() === req.user.id.toString();

    // Verify member permissions
    if (!isAdmin) {
      if (!isAssignee) {
        res.status(403);
        throw new Error('Not authorized to update this task (Must be Admin or Assignee)');
      }
      
      // Assignee is only allowed to update status
      const allowedUpdates = ['status'];
      const incomingUpdates = Object.keys(req.body);
      const isTryingToUpdateForbiddenFields = incomingUpdates.some(key => !allowedUpdates.includes(key));
      
      if (isTryingToUpdateForbiddenFields) {
         res.status(403);
         throw new Error('Members can only update the status of their assigned tasks');
      }
    }

    // Process updates
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true, runValidators: true })
      .populate('assigned_to', 'name email')
      .populate('created_by', 'name email');
      
    res.status(200).json(updatedTask);
  } catch(error) { next(error); }
};

// @desc    Delete Task
// @route   DELETE /api/tasks/:taskId
// @access  Private (Admin only)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) { res.status(404); throw new Error('Task not found'); }

    const membership = await getMembership(task.project_id, req.user.id);
    if (!membership || membership.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete tasks (Admin only)');
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: 'Task deleted successfully', id: req.params.taskId });
  } catch(error) { next(error); }
};

// @desc    Get Dashboard Stats
// @route   GET /api/projects/:id/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const membership = await getMembership(projectId, req.user.id);
    if (!membership) {
      res.status(403);
      throw new Error('Not authorized to view this dashboard');
    }

    const tasks = await Task.find({ project_id: projectId });
    
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const in_progress = tasks.filter(t => t.status === 'in_progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const done = tasks.filter(t => t.status === 'done').length;
    
    // Virtual property evaluation
    const overdue = tasks.filter(t => t.isOverdue).length;

    res.status(200).json({
      total,
      todo,
      in_progress,
      review,
      done,
      overdue
    });
  } catch(error) { next(error); }
};

module.exports = {
  createTask, getProjectTasks, getTaskById, updateTask, deleteTask, getDashboardStats
};
