const express = require('express');
const router = express.Router();
const {
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/tasks/:taskId
// PATCH /api/tasks/:taskId
// DELETE /api/tasks/:taskId
router
  .route('/:taskId')
  .get(protect, getTaskById)
  .patch(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
