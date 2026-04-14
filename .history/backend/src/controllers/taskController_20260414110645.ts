import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { body, validationResult } from 'express-validator';
import { calculatePlatformFee } from '../utils/helpers';

export const createTask = [
  body('type').isIn(['FOLLOW', 'LIKE', 'REPOST', 'QUOTE', 'POST']).withMessage('Invalid task type'),
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description required'),
  body('rewardPerTask').isFloat({ min: 0.01 }).withMessage('Invalid reward'),
  body('totalBudget').isFloat({ min: 1 }).withMessage('Invalid budget'),
  body('isPremium').isBoolean().optional().withMessage('Invalid premium flag'),
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (user?.role !== 'CREATOR' && user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only creators can create tasks' });
      }

      const { type, title, description, rewardPerTask, totalBudget, isPremium } = req.body;

      // Validate premium tasks
      if (isPremium && !user.isPremiumAccount) {
        return res.status(403).json({ error: 'Premium account required for premium tasks' });
      }

      const platformFee = calculatePlatformFee(totalBudget);
      const task = await prisma.task.create({
        data: {
          creatorId: req.userId,
          type,
          title,
          description,
          rewardPerTask,
          totalBudget,
          remainingBudget: totalBudget,
          isPremium: isPremium || false,
          platformFeeApplied: platformFee,
          imageUrl: req.body.imageUrl || null,
        },
      });

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },
];

export const getTasksForUser = async (req: any, res: Response) => {
  try {
    const { status, type, page = 1, limit = 20, premium = false } = req.query;

    const where: any = {
      status: 'ACTIVE',
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (premium === 'true') where.isPremium = true;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: {
          select: { username: true, avatarUrl: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.task.count({ where });

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getCreatorTasks = async (req: any, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { creatorId: req.userId },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get creator tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const submitTask = [
  body('taskId').isString().withMessage('Task ID required'),
  body('proof').isURL().withMessage('Valid proof URL required'),
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { taskId, proof } = req.body;

      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (task.status !== 'ACTIVE') {
        return res.status(400).json({ error: 'Task is not active' });
      }

      // Check if user already submitted
      const existing = await prisma.taskSubmission.findUnique({
        where: {
          taskId_userId: { taskId, userId: req.userId },
        },
      });

      if (existing) {
        return res.status(400).json({ error: 'Already submitted for this task' });
      }

      const submission = await prisma.taskSubmission.create({
        data: {
          taskId,
          userId: req.userId,
          proof,
          reward: task.rewardPerTask,
          status: 'PENDING',
        },
      });

      res.status(201).json({
        message: 'Task submitted for review',
        submission,
      });
    } catch (error) {
      console.error('Submit task error:', error);
      res.status(500).json({ error: 'Failed to submit task' });
    }
  },
];

export const getUserSubmissions = async (req: any, res: Response) => {
  try {
    const submissions = await prisma.taskSubmission.findMany({
      where: { userId: req.userId },
      include: {
        task: {
          select: {
            title: true,
            type: true,
            rewardPerTask: true,
            creator: { select: { username: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};
