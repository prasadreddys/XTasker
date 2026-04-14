'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { taskApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { CheckCircle, Clock, XCircle, Link as LinkIcon } from 'lucide-react';

interface Submission {
  id: string;
  status: string;
  reward: number;
  proof: string;
  submittedAt: string;
  rejectionReason?: string;
  task: {
    title: string;
    type: string;
    rewardPerTask: number;
  };
}

export default function SubmissionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchSubmissions();
  }, [user, router]);

  const fetchSubmissions = async () => {
    try {
      const res = await taskApi.getUserSubmissions();
      setSubmissions(res.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'PENDING':
        return <Clock className="text-yellow-400" size={24} />;
      case 'REJECTED':
        return <XCircle className="text-red-400" size={24} />;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">My Submissions</h1>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No submissions yet. Start completing tasks!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-darker border border-accent/10 rounded-lg p-6 hover:border-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold">{submission.task.title}</h3>
                        <span className="bg-accent/20 text-accent px-3 py-1 rounded text-sm">
                          {submission.task.type}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>

                      {submission.status === 'REJECTED' && submission.rejectionReason && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                          <p className="text-red-300 text-sm">
                            <strong>Rejection reason:</strong> {submission.rejectionReason}
                          </p>
                        </div>
                      )}

                      <a
                        href={submission.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm flex items-center gap-2"
                      >
                        <LinkIcon size={16} />
                        View Proof
                      </a>
                    </div>

                    <div className="flex items-center gap-6 ml-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">
                          ${submission.reward.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">Reward</p>
                      </div>
                      {getStatusIcon(submission.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
