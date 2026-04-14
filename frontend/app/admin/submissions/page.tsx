'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { adminApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle } from 'lucide-react';

interface Submission {
  id: string;
  status: string;
  reward: number;
  proof: string;
  task: {
    title: string;
    type: string;
  };
  user: {
    username: string;
    xHandle: string;
  };
}

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin');
      return;
    }

    fetchSubmissions();
  }, [user, router]);

  const fetchSubmissions = async () => {
    try {
      const res = await adminApi.getPendingSubmissions();
      setSubmissions(res.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    try {
      await adminApi.approveSubmission(submissionId);
      setSubmissions(submissions.filter((s) => s.id !== submissionId));
      alert('Submission approved');
    } catch (error) {
      alert('Failed to approve submission');
    }
  };

  const handleReject = async (submissionId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await adminApi.rejectSubmission(submissionId, rejectionReason);
      setSubmissions(submissions.filter((s) => s.id !== submissionId));
      setSelectedSubmission(null);
      setRejectionReason('');
      alert('Submission rejected');
    } catch (error) {
      alert('Failed to reject submission');
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Manage Submissions</h1>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No pending submissions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-darker border border-accent/10 rounded-lg p-6 hover:border-accent/30 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-bold mb-2">{submission.task.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        By <strong>@{submission.user.xHandle}</strong> ({submission.user.username})
                      </p>
                      <a
                        href={submission.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm"
                      >
                        View Proof →
                      </a>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Task Type</p>
                      <p className="text-accent font-bold">{submission.task.type}</p>
                      <p className="text-gray-400 text-sm mt-3 mb-1">Reward Amount</p>
                      <p className="text-green-400 text-xl font-bold">
                        ${submission.reward.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(submission.id)}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedSubmission(submission.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} />
                        Reject
                      </button>
                    </div>
                  </div>

                  {selectedSubmission === submission.id && (
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
                          onClick={() => handleReject(submission.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubmission(null);
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
