import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  const options = { expiresIn: '7d' as const };
  return jwt.sign({ userId, role }, Buffer.from(secret), options);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const calculatePlatformFee = (amount: number) => {
  const feePercentage = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '15');
  return (amount * feePercentage) / 100;
};

export const calculateUserReward = (amount: number) => {
  const fee = calculatePlatformFee(amount);
  return amount - fee;
};
