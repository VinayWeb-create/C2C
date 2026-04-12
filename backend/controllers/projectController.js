import asyncHandler from '../utils/asyncHandler.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a new project (Admin only)
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = asyncHandler(async (req, res) => {
    req.body.postedBy = req.user._id;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
});

// @desc    Get all open projects
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ status: 'open' })
        .populate('postedBy', 'name email');
    res.json({ success: true, projects });
});

// @desc    Apply for a project (Provider only)
// @route   POST /api/projects/:id/apply
// @access  Private/Provider
export const applyForProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    if (project.status !== 'open') {
        res.status(400);
        throw new Error('Project is no longer accepting applications');
    }

    // Check if player already applied
    const alreadyApplied = project.applications.find(
        (app) => app.provider.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
        res.status(400);
        throw new Error('You have already applied for this project');
    }

    project.applications.push({
        provider: req.user._id,
        notes: req.body.notes
    });

    await project.save();
    res.json({ success: true, message: 'Application submitted successfully' });
});

// @desc    Get project applications (Admin only)
// @route   GET /api/projects/:id/applications
// @access  Private/Admin
export const getProjectApplications = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('applications.provider', 'name email professionalInfo badges');

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    res.json({ success: true, applications: project.applications });
});

// @desc    Assign project to a provider (Admin only)
// @route   PUT /api/projects/:id/assign
// @access  Private/Admin
export const assignProject = asyncHandler(async (req, res) => {
    const { providerId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    project.status = 'assigned';
    project.assignedTo = providerId;
    
    // Update application status
    project.applications.forEach(app => {
        if (app.provider.toString() === providerId.toString()) {
            app.status = 'accepted';
        } else {
            app.status = 'rejected';
        }
    });

    await project.save();
    res.json({ success: true, message: 'Project assigned successfully', project });
});

// @desc    Get my applications (Provider only)
// @route   GET /api/projects/my-applications
// @access  Private/Provider
export const getMyApplications = asyncHandler(async (req, res) => {
    const projects = await Project.find({
        'applications.provider': req.user._id
    }).select('title status budget deadline');

    res.json({ success: true, projects });
});
