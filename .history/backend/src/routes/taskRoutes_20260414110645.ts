import { Router } from 'express';
import {
  createTask,
  getTasksForUser,
  getCreatorTasks,
  submitTask,
  getUserSubmissions,
} from '../controllers/taskController';
import { authMiddleware, creatorMiddleware } from '../middleware/auth';

const router = Router();

// User routes
router.get('/available', authMiddleware, getTasksForUser);
router.post('/submit', authMiddleware, submitTask);
router.get('/my-submissions', authMiddleware, getUserSubmissions);

// Creator routes
router.post('/', authMiddleware, creatorMiddleware, createTask);
router.get('/my-tasks', authMiddleware, creatorMiddleware, getCreatorTasks);

export default router;
