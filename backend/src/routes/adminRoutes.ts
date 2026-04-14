import { Router } from 'express';
import {
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getAnalytics,
  suspendUser,
} from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Submission management
router.get('/submissions/pending', getPendingSubmissions);
router.post('/submissions/approve', approveSubmission);
router.post('/submissions/reject', rejectSubmission);

// Withdrawal management
router.get('/withdrawals/pending', getPendingWithdrawals);
router.post('/withdrawals/approve', approveWithdrawal);
router.post('/withdrawals/reject', rejectWithdrawal);

// Analytics
router.get('/analytics', getAnalytics);

// User management
router.post('/users/suspend', suspendUser);

export default router;
