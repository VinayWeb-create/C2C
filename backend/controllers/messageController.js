import asyncHandler from '../utils/asyncHandler.js';
import Message from '../models/Message.js';
import Project from '../models/Project.js';

// @desc    Get messages for a project
// @route   GET /api/messages/:projectId
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Only allow admin or the assigned provider to see messages
    const isAdmin = req.user.role === 'admin';
    const isAssigned = project.assignedTo?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssigned) {
        res.status(403);
        throw new Error('You are not authorized to view this workroom');
    }

    const messages = await Message.find({ project: req.params.projectId })
        .populate('sender', 'name avatar role')
        .sort('createdAt');

    res.json({ success: true, messages });
});

// @desc    Send a message
// @route   POST /api/messages/:projectId
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    // Only allow admin or the assigned provider to send messages
    const isAdmin = req.user.role === 'admin';
    const isAssigned = project.assignedTo?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssigned) {
        res.status(403);
        throw new Error('You are not authorized to post in this workroom');
    }

    const message = await Message.create({
        project: req.params.projectId,
        sender: req.user._id,
        content
    });

    res.status(201).json({ success: true, message });
});
