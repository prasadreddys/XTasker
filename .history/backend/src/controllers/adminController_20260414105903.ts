import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { body, validationResult } from 'express-validator';

export const getPendingSubmissions = async (req: any, res: Response) => {
  try {
    const submissions = await prisma.taskSubmission.findMany({
      where: { status: 'PENDING' },
      include: {
        task: { select: { title: true, type: true } },
        user: { select: { username: true, xHandle: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const approveSubmission = [
  body('submissionId').isString().withMessage('Submission ID required'),
  async (req: any, res: Response) => {
    try {
      const { submissionId } = req.body;

      const submission = await prisma.taskSubmission.findUnique({
        where: { id: submissionId },
        include: { user: true, task: true },
      });

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      // Approve submission
      const updated = await prisma.taskSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: req.userId,
        },
      });

      // Add earnings to user wallet
      const reward = submission.reward;
      await prisma.user.update({
        where: { id: submission.userId },
        data: {
          walletBalance: { increment: reward },
          totalEarned: { increment: reward },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: submission.userId,
          amount: reward,
          type: 'EARNING',
          status: 'completed',
          description: `Reward for ${submission.task.type} task`,
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          action: 'APPROVE_SUBMISSION',
          tableName: 'TaskSubmission',
          recordId: submissionId,
          userId: req.userId,
          oldValue: 'PENDING',
          newValue: 'APPROVED',
        },
      });

      res.json({
        message: 'Submission approved',
        submission: updated,
      });
    } catch (error) {
      console.error('Approve submission error:', error);
      res.status(500).json({ error: 'Failed to approve submission' });
    }
  },
];

export const rejectSubmission = [
  body('submissionId').isString().withMessage('Submission ID required'),
  body('reason').trim().isLength({ min: 5 }).withMessage('Rejection reason required'),
  async (req: any, res: Response) => {
    try {
      const { submissionId, reason } = req.body;

      const submission = await prisma.taskSubmission.findUnique({
        where: { id: submissionId },
      });

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      const updated = await prisma.taskSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
          reviewedAt: new Date(),
          reviewedBy: req.userId,
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          action: 'REJECT_SUBMISSION',
          tableName: 'TaskSubmission',
          recordId: submissionId,
          userId: req.userId,
          newValue: reason,
        },
      });

      res.json({
        message: 'Submission rejected',
        submission: updated,
      });
    } catch (error) {
      console.error('Reject submission error:', error);
      res.status(500).json({ error: 'Failed to reject submission' });
    }
  },
];

export const getPendingWithdrawals = async (req: any, res: Response) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { username: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(withdrawals);
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

export const approveWithdrawal = [
  body('withdrawalId').isString().withMessage('Withdrawal ID required'),
  async (req: any, res: Response) => {
    try {
      const { withdrawalId } = req.body;

      const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: withdrawalId },
      });

      if (!withdrawal) {
        return res.status(404).json({ error: 'Withdrawal not found' });
      }

      const updated = await prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });

      res.json({
        message: 'Withdrawal approved',
        withdrawal: updated,
      });
    } catch (error) {
      console.error('Approve withdrawal error:', error);
      res.status(500).json({ error: 'Failed to approve withdrawal' });
    }
  },
];

export const rejectWithdrawal = [
  body('withdrawalId').isString().withMessage('Withdrawal ID required'),
  body('reason').trim().isLength({ min: 5 }).withMessage('Reason required'),
  async (req: any, res: Response) => {
    try {
      const { withdrawalId, reason } = req.body;

      const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: withdrawalId },
        include: { user: true },
      });

      if (!withdrawal) {
        return res.status(404).json({ error: 'Withdrawal not found' });
      }

      const updated = await prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'REJECTED',
          failureReason: reason,
        },
      });

      // Restore balance to user
      await prisma.user.update({
        where: { id: withdrawal.userId },
        data: {
          walletBalance: { increment: withdrawal.amount },
        },
      });

      res.json({
        message: 'Withdrawal rejected',
        withdrawal: updated,
      });
    } catch (error) {
      console.error('Reject withdrawal error:', error);
      res.status(500).json({ error: 'Failed to reject withdrawal' });
    }
  },
];

export const getAnalytics = async (req: any, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({
      where: { status: 'COMPLETED' },
    });
    const totalSubmissions = await prisma.taskSubmission.count({
      where: { status: 'APPROVED' },
    });

    const totalEarnings = await prisma.transaction.aggregate({
      where: { type: 'EARNING' },
      _sum: { amount: true },
    });

    res.json({
      totalUsers,
      totalTasks,
      completedTasks,
      totalSubmissions,
      totalEarnings: totalEarnings._sum.amount || 0,
      activeCreators: await prisma.user.count({
        where: { role: 'CREATOR' },
      }),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const suspendUser = [
  body('userId').isString().withMessage('User ID required'),
  async (req: any, res: Response) => {
    try {
      const { userId } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { isSuspended: true },
      });

      res.json({
        message: 'User suspended',
        user,
      });
    } catch (error) {
      console.error('Suspend user error:', error);
      res.status(500).json({ error: 'Failed to suspend user' });
    }
  },
];
