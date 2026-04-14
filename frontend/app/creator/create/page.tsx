'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { taskApi } from '@/lib/api';
import Navbar from '@/components/Navbar';

const taskTypes = [
  { value: 'FOLLOW', label: 'Follow', reward: 0.5 },
  { value: 'LIKE', label: 'Like', reward: 0.25 },
  { value: 'REPOST', label: 'Repost', reward: 1.0 },
  { value: 'QUOTE', label: 'Quote', reward: 2.0 },
  { value: 'POST', label: 'Post', reward: 3.0 },
];

export default function CreateTaskPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    type: 'LIKE',
    title: '',
    description: '',
    rewardPerTask: 0.25,
    totalBudget: 100,
    isPremium: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await taskApi.createTask(formData);
      router.push('/creator');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Create Task</h1>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-darker border border-accent/10 rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-lg font-bold mb-3">Task Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {taskTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`p-3 rounded-lg text-center cursor-pointer transition-all border ${
                      formData.type === type.value
                        ? 'bg-accent/20 border-accent'
                        : 'bg-dark border-accent/10 hover:border-accent/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs text-gray-400">${type.reward.toFixed(2)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-lg font-bold mb-2 block">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Follow @XTasker"
                className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="text-lg font-bold mb-2 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Detailed description of what users need to do"
                className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-lg font-bold mb-2 block">Reward Per Task</label>
                <div className="flex items-center">
                  <span className="text-accent mr-2">$</span>
                  <input
                    type="number"
                    name="rewardPerTask"
                    value={formData.rewardPerTask}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    required
                    className="flex-1 bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-lg font-bold mb-2 block">Total Budget</label>
                <div className="flex items-center">
                  <span className="text-accent mr-2">$</span>
                  <input
                    type="number"
                    name="totalBudget"
                    value={formData.totalBudget}
                    onChange={handleChange}
                    step="1"
                    min="1"
                    required
                    className="flex-1 bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-dark rounded-lg border border-accent/10">
              <input
                type="checkbox"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="cursor-pointer flex-1">
                <p className="font-medium">Premium Task</p>
                <p className="text-sm text-gray-400">
                  Only verified X accounts can complete this task
                </p>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-dark py-3 rounded-lg font-bold text-lg hover:bg-accent/90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
