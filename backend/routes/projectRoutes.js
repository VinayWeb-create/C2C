import express from 'express';
import {
    createProject,
    getProjects,
    applyForProject,
    getProjectApplications,
    assignProject,
    getMyApplications
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getProjects)
    .post(authorize('admin'), createProject);

router.get('/my-applications', authorize('provider'), getMyApplications);

router.post('/:id/apply', authorize('provider'), applyForProject);

router.route('/:id/applications')
    .get(authorize('admin'), getProjectApplications);

router.put('/:id/assign', authorize('admin'), assignProject);

export default router;
