import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { body, validationResult } from 'express-validator';
import { calculateUserReward } from '../utils/helpers';

export const getWalletBalance = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { walletBalance: true, totalEarned: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

export const getTransactionHistory = async (req: any, res: Response) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const where: any = { userId: req.userId };
    if (type) where.type = type;

    const transactions = await prisma.transaction.findMany({
      where,
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.transaction.count({ where });

    res.json({
      transactions,
      pagination: { total, page: parseInt(page as string) },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const requestWithdrawal = [
  body('amount').isFloat({ min: parseFloat(process.env.MIN_WITHDRAWAL_AMOUNT || '1') }).withMessage('Invalid amount'),
  body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, walletAddress } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { walletBalance: true },
      });

      if (!user || user.walletBalance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Check for existing pending withdrawals
      const pending = await prisma.withdrawal.findFirst({
        where: {
          userId: req.userId,
          status: 'PENDING',
        },
      });

      if (pending) {
        return res.status(400).json({ error: 'Already have pending withdrawal' });
      }

      const withdrawal = await prisma.withdrawal.create({
        data: {
          userId: req.userId,
          amount,
          walletAddress,
          status: 'PENDING',
        },
      });

      // Deduct from balance immediately
      await prisma.user.update({
        where: { id: req.userId },
        data: {
          walletBalance: { decrement: amount },
        },
      });

      res.status(201).json({
        message: 'Withdrawal requested',
        withdrawal,
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      res.status(500).json({ error: 'Failed to process withdrawal' });
    }
  },
];

export const getWithdrawalHistory = async (req: any, res: Response) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(withdrawals);
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

export const depositFunds = [
  body('amount').isFloat({ min: 1 }).withMessage('Invalid amount'),
  async (req: any, res: Response) => {
    try {
      // This would connect to payment processing (Stripe, etc.)
      const { amount } = req.body;

      const transaction = await prisma.transaction.create({
        data: {
          userId: req.userId,
          amount,
          type: 'DEPOSIT',
          status: 'pending',
          description: 'User deposit',
        },
      });

      res.json({
        message: 'Deposit initiated',
        transaction,
      });
    } catch (error) {
      console.error('Deposit error:', error);
      res.status(500).json({ error: 'Failed to process deposit' });
    }
  },
];
