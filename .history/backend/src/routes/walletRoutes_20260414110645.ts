import { Router } from 'express';
import {
  getWalletBalance,
  getTransactionHistory,
  requestWithdrawal,
  getWithdrawalHistory,
  depositFunds,
} from '../controllers/walletController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/balance', authMiddleware, getWalletBalance);
router.get('/transactions', authMiddleware, getTransactionHistory);
router.post('/withdraw', authMiddleware, requestWithdrawal);
router.get('/withdrawals', authMiddleware, getWithdrawalHistory);
router.post('/deposit', authMiddleware, depositFunds);

export default router;
