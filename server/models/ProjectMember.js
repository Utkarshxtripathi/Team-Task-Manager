const mongoose = require('mongoose');

const projectMemberSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      required: true,
      default: 'member',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent adding the same user to the same project more than once
projectMemberSchema.index({ project_id: 1, user_id: 1 }, { unique: true });

const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);

module.exports = ProjectMember;
