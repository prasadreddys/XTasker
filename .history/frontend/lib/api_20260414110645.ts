import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authApi = {
  register: (data: { username: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Task endpoints
export const taskApi = {
  getAvailableTasks: (params?: any) =>
    api.get('/tasks/available', { params }),
  getCreatorTasks: () =>
    api.get('/tasks/my-tasks'),
  createTask: (data: any) =>
    api.post('/tasks', data),
  submitTask: (data: { taskId: string; proof: string }) =>
    api.post('/tasks/submit', data),
  getUserSubmissions: () =>
    api.get('/tasks/my-submissions'),
};

// Wallet endpoints
export const walletApi = {
  getBalance: () =>
    api.get('/wallet/balance'),
  getTransactions: (params?: any) =>
    api.get('/wallet/transactions', { params }),
  requestWithdrawal: (data: { amount: number; walletAddress: string }) =>
    api.post('/wallet/withdraw', data),
  getWithdrawals: () =>
    api.get('/wallet/withdrawals'),
  deposit: (data: { amount: number }) =>
    api.post('/wallet/deposit', data),
};

// Admin endpoints
export const adminApi = {
  getPendingSubmissions: () =>
    api.get('/admin/submissions/pending'),
  approveSubmission: (submissionId: string) =>
    api.post('/admin/submissions/approve', { submissionId }),
  rejectSubmission: (submissionId: string, reason: string) =>
    api.post('/admin/submissions/reject', { submissionId, reason }),
  getPendingWithdrawals: () =>
    api.get('/admin/withdrawals/pending'),
  approveWithdrawal: (withdrawalId: string) =>
    api.post('/admin/withdrawals/approve', { withdrawalId }),
  rejectWithdrawal: (withdrawalId: string, reason: string) =>
    api.post('/admin/withdrawals/reject', { withdrawalId, reason }),
  getAnalytics: () =>
    api.get('/admin/analytics'),
  suspendUser: (userId: string) =>
    api.post('/admin/users/suspend', { userId }),
};

export default api;
