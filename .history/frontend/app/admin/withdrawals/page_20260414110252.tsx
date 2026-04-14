'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { adminApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { CheckCircle, Clock, XCircle, Copy } from 'lucide-react';

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  walletAddress: string;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
}

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin');
      return;
    }

    fetchWithdrawals();
  }, [user, router]);

  const fetchWithdrawals = async () => {
    try {
      const res = await adminApi.getPendingWithdrawals();
      setWithdrawals(res.data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    try {
      await adminApi.approveWithdrawal(withdrawalId);
      setWithdrawals(withdrawals.filter((w) => w.id !== withdrawalId));
      alert('Withdrawal approved');
    } catch (error) {
      alert('Failed to approve withdrawal');
    }
  };

  const handleReject = async (withdrawalId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await adminApi.rejectWithdrawal(withdrawalId, rejectionReason);
      setWithdrawals(withdrawals.filter((w) => w.id !== withdrawalId));
      setSelectedWithdrawal(null);
      setRejectionReason('');
      alert('Withdrawal rejected');
    } catch (error) {
      alert('Failed to reject withdrawal');
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    alert('Address copied!');
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Manage Withdrawals</h1>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No pending withdrawals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="bg-darker border border-accent/10 rounded-lg p-6 hover:border-accent/30 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-bold mb-2">{withdrawal.user.username}</h3>
                      <p className="text-gray-400 text-sm mb-3">{withdrawal.user.email}</p>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Wallet Address (Base)</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-dark px-2 py-1 rounded break-all">
                            {withdrawal.walletAddress}
                          </code>
                          <button
                            onClick={() => copyAddress(withdrawal.walletAddress)}
                            className="text-accent hover:text-accent/80"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Amount</p>
                      <p className="text-3xl font-bold text-green-400">
                        ${withdrawal.amount.toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm mt-3 mb-1">Requested On</p>
                      <p className="text-sm">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(withdrawal.id)}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedWithdrawal(withdrawal.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} />
                        Reject
                      </button>
                    </div>
                  </div>

                  {selectedWithdrawal === withdrawal.id && (
                    <div className="mt-4 pt-4 border-t border-accent/10">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        rows={3}
                        className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none resize-none"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleReject(withdrawal.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWithdrawal(null);
                            setRejectionReason('');
                          }}
                          className="border border-accent text-accent px-4 py-2 rounded-lg font-medium hover:bg-accent/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
