const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please provide a project name');
    }

    // Create the project
    const project = await Project.create({
      name,
      description,
      admin_id: req.user.id,
    });

    // Auto-assign the creator as an 'admin' in the ProjectMember table
    await ProjectMember.create({
      project_id: project._id,
      user_id: req.user.id,
      role: 'admin',
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    // Find all memberships for the current user and populate the actual project details
    const memberships = await ProjectMember.find({ user_id: req.user.id })
      .populate('project_id')
      .exec();

    // Format the response to return the project details along with the user's role
    const projects = memberships
      .filter((m) => m.project_id) // ensure project_id wasn't deleted
      .map((m) => ({
        ...m.project_id._doc,
        userRole: m.role,
      }));

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    // Verify if the user is a member of this project
    const membership = await ProjectMember.findOne({
      project_id: projectId,
      user_id: req.user.id,
    });

    if (!membership) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    // Fetch the project
    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Return the project details along with user's specific role
    res.status(200).json({
      ...project._doc,
      userRole: membership.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PATCH /api/projects/:id
// @access  Private (Admin only)
const updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { name, description } = req.body;

    // Verify if the user is an admin of this project
    const membership = await ProjectMember.findOne({
      project_id: projectId,
      user_id: req.user.id,
    });

    if (!membership || membership.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this project (Admin only)');
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      res.status(404);
      throw new Error('Project not found');
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    // Verify if the user is an admin of this project
    const membership = await ProjectMember.findOne({
      project_id: projectId,
      user_id: req.user.id,
    });

    if (!membership || membership.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this project (Admin only)');
    }

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    // Clean up: delete all project members associated with this project
    await ProjectMember.deleteMany({ project_id: projectId });

    res.status(200).json({ message: 'Project removed successfully', id: projectId });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to a project
// @route   POST /api/projects/:id/members
// @access  Private (Admin only)
const addMember = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { email, role } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    // Verify if the requesting user is an admin of this project
    const adminMembership = await ProjectMember.findOne({
      project_id: projectId,
      user_id: req.user.id,
    });

    if (!adminMembership || adminMembership.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to add members (Admin only)');
    }

    // Find the user to add
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      res.status(404);
      throw new Error('User not found');
    }

    // Check if user is already a member
    const existingMember = await ProjectMember.findOne({
      project_id: projectId,
      user_id: userToAdd._id,
    });

    if (existingMember) {
      res.status(400);
      throw new Error('User is already a member of this project');
    }

    // Create the membership
    const newMember = await ProjectMember.create({
      project_id: projectId,
      user_id: userToAdd._id,
      role: role && ['admin', 'member'].includes(role) ? role : 'member',
    });

    res.status(201).json(newMember);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members/:uid
// @access  Private (Admin only)
const removeMember = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.uid;

    // Verify if the requesting user is an admin of this project
    const adminMembership = await ProjectMember.findOne({
      project_id: projectId,
      user_id: req.user.id,
    });

    if (!adminMembership || adminMembership.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to remove members (Admin only)');
    }

    // Optional: Prevent admin from removing themselves if they are the only admin
    // For simplicity, we just allow the deletion for now.

    const memberToRemove = await ProjectMember.findOneAndDelete({
      project_id: projectId,
      user_id: memberId,
    });

    if (!memberToRemove) {
      res.status(404);
      throw new Error('Member not found in this project');
    }

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members of a project
// @route   GET /api/projects/:id/members
// @access  Private
const getMembers = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    // Verify if the requesting user is a member of this project
    const membership = await ProjectMember.findOne({
      project_id: projectId,
      user_id: req.user.id,
    });

    if (!membership) {
      res.status(403);
      throw new Error('Not authorized to view members of this project');
    }

    // Find all memberships for this project, and populate the user details (name, email)
    const members = await ProjectMember.find({ project_id: projectId })
      .populate('user_id', 'name email')
      .exec();

    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMembers,
};
