'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { taskApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Send, AlertCircle } from 'lucide-react';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [proofUrl, setProofUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // In a real app, fetch task details by ID
    setLoading(false);
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!proofUrl.trim()) {
      setError('Please provide proof URL');
      return;
    }

    setSubmitting(true);
    try {
      await taskApi.submitTask({
        taskId: params.id as string,
        proof: proofUrl,
      });
      setSubmitted(true);
      setProofUrl('');
      alert('Task submitted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="text-accent hover:underline mb-6"
          >
            ← Back
          </button>

          {loading ? (
            <div className="text-center text-gray-400">Loading task...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-darker border border-accent/10 rounded-lg p-8">
                  <h1 className="text-4xl font-bold mb-4">Follow Our Twitter Account</h1>

                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Task Type</p>
                      <span className="bg-accent/20 text-accent px-4 py-1 rounded inline-block">
                        FOLLOW
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-2">Description</p>
                      <p className="text-white leading-relaxed">
                        Follow @ExampleAccount and make sure you're verified. This is a legitimate account
                        with high engagement. After following, reply to the pinned tweet with 👍.
                      </p>
                    </div>

                    <div className="border-t border-accent/10 pt-4">
                      <p className="text-gray-400 text-sm mb-2">Requirements</p>
                      <ul className="list-disc list-inside text-white space-y-1">
                        <li>Account must be at least 1 week old</li>
                        <li>Must follow the account</li>
                        <li>Reply with proof emoji to pinned tweet</li>
                        <li>Don't unfollow for 30 days</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
                      <p className="text-blue-200 text-sm">
                        Make sure to follow all requirements. Fake or suspicious submissions will be rejected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-darker border border-accent/10 rounded-lg p-6 sticky top-20">
                  <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm">Reward Amount</p>
                    <p className="text-4xl font-bold text-accent mt-2">$0.50</p>
                  </div>

                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Proof Link (Screenshot or Tweet Link)
                        </label>
                        <input
                          type="url"
                          value={proofUrl}
                          onChange={(e) => setProofUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none text-sm"
                        />
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-200 p-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-accent text-dark py-2 rounded-lg font-bold hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Send size={20} />
                        {submitting ? 'Submitting...' : 'Submit Task'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center">
                      <p className="text-green-400 font-bold mb-3">✓ Submitted!</p>
                      <p className="text-gray-400 text-sm mb-4">
                        Your submission is under review. You'll be notified when it's approved.
                      </p>
                      <button
                        onClick={() => router.push('/dashboard/submissions')}
                        className="w-full bg-accent/20 text-accent py-2 rounded-lg font-medium hover:bg-accent/30"
                      >
                        View Submissions
                      </button>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-accent/10 text-xs text-gray-500">
                    <p>After submission, your proof will be reviewed by our team within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
