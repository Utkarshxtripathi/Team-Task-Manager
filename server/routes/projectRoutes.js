const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMembers,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/projects
// GET /api/projects
router.route('/').post(protect, createProject).get(protect, getProjects);

// GET /api/projects/:id
// PATCH /api/projects/:id
// DELETE /api/projects/:id
router
  .route('/:id')
  .get(protect, getProjectById)
  .patch(protect, updateProject)
  .delete(protect, deleteProject);

// GET /api/projects/:id/members
// POST /api/projects/:id/members
router.route('/:id/members').get(protect, getMembers).post(protect, addMember);

// DELETE /api/projects/:id/members/:uid
router.delete('/:id/members/:uid', protect, removeMember);

const {
  createTask,
  getProjectTasks,
  getDashboardStats,
} = require('../controllers/taskController');

// POST /api/projects/:id/tasks
router.post('/:id/tasks', protect, createTask);

// GET /api/projects/:id/tasks
router.get('/:id/tasks', protect, getProjectTasks);

// GET /api/projects/:id/dashboard
router.get('/:id/dashboard', protect, getDashboardStats);

module.exports = router;


