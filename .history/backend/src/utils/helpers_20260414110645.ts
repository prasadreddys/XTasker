import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
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
