'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useWalletStore } from '@/lib/store';
import { walletApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setBalance, setTotalEarned } = useWalletStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ balance: 0, totalEarned: 0, completed: 0 });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const walletRes = await walletApi.getBalance();
        setBalance(walletRes.data.walletBalance);
        setTotalEarned(walletRes.data.totalEarned);
        setStats({
          balance: walletRes.data.walletBalance,
          totalEarned: walletRes.data.totalEarned,
          completed: 0,
        });
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router, setBalance, setTotalEarned]);

  if (!user) return null;
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-dark flex items-center justify-center">
          <div className="text-white text-lg">Loading dashboard...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-darker border border-accent/10 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Balance</p>
                  <p className="text-3xl font-bold text-accent mt-2">
                    ${stats.balance.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="text-accent" size={40} />
              </div>
            </div>

            <div className="bg-darker border border-accent/10 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Earned</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">
                    ${stats.totalEarned.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="text-green-400" size={40} />
              </div>
            </div>

            <div className="bg-darker border border-accent/10 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tasks Completed</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="text-blue-400" size={40} />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/dashboard/tasks"
              className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all"
            >
              <h2 className="text-xl font-bold mb-2">Available Tasks</h2>
              <p className="text-gray-400">Browse and complete engagement tasks</p>
            </a>

            <a
              href="/dashboard/wallet"
              className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all"
            >
              <h2 className="text-xl font-bold mb-2">Wallet & Withdrawals</h2>
              <p className="text-gray-400">View transactions and withdraw earnings</p>
            </a>

            <a
              href="/dashboard/submissions"
              className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all"
            >
              <h2 className="text-xl font-bold mb-2">My Submissions</h2>
              <p className="text-gray-400">Track your task submission status</p>
            </a>

            <a
              href="/dashboard/profile"
              className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all"
            >
              <h2 className="text-xl font-bold mb-2">Profile</h2>
              <p className="text-gray-400">Manage your account and X handle</p>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
