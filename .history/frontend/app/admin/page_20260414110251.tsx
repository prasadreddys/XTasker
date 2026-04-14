'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { adminApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Users, FileText, Wallet, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchAnalytics();
  }, [user, router]);

  const fetchAnalytics = async () => {
    try {
      const res = await adminApi.getAnalytics();
      setAnalytics(res.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <>
              {/* Analytics Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-darker border border-accent/10 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-3xl font-bold mt-2">{analytics?.totalUsers}</p>
                    </div>
                    <Users className="text-accent" size={40} />
                  </div>
                </div>

                <div className="bg-darker border border-accent/10 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Tasks</p>
                      <p className="text-3xl font-bold mt-2">{analytics?.totalTasks}</p>
                    </div>
                    <FileText className="text-accent" size={40} />
                  </div>
                </div>

                <div className="bg-darker border border-accent/10 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Earnings</p>
                      <p className="text-3xl font-bold text-green-400 mt-2">
                        ${analytics?.totalEarnings.toFixed(2)}
                      </p>
                    </div>
                    <Wallet className="text-green-400" size={40} />
                  </div>
                </div>

                <div className="bg-darker border border-accent/10 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Creators</p>
                      <p className="text-3xl font-bold text-blue-400 mt-2">
                        {analytics?.activeCreators}
                      </p>
                    </div>
                    <TrendingUp className="text-blue-400" size={40} />
                  </div>
                </div>
              </div>

              {/* Management Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="/admin/submissions"
                  className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all cursor-pointer group"
                >
                  <h2 className="text-xl font-bold group-hover:text-accent mb-2">
                    Manage Submissions
                  </h2>
                  <p className="text-gray-400">Review and approve/reject task submissions</p>
                </a>

                <a
                  href="/admin/withdrawals"
                  className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all cursor-pointer group"
                >
                  <h2 className="text-xl font-bold group-hover:text-accent mb-2">
                    Manage Withdrawals
                  </h2>
                  <p className="text-gray-400">Process pending withdrawal requests</p>
                </a>

                <a
                  href="/admin/users"
                  className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all cursor-pointer group"
                >
                  <h2 className="text-xl font-bold group-hover:text-accent mb-2">
                    User Management
                  </h2>
                  <p className="text-gray-400">View users and manage suspicious activity</p>
                </a>

                <a
                  href="/admin/analytics"
                  className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all cursor-pointer group"
                >
                  <h2 className="text-xl font-bold group-hover:text-accent mb-2">
                    Analytics
                  </h2>
                  <p className="text-gray-400">View detailed platform analytics</p>
                </a>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
