'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { taskApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Plus, Edit, Pause, Play } from 'lucide-react';

interface CreatorTask {
  id: string;
  title: string;
  type: string;
  description: string;
  rewardPerTask: number;
  totalBudget: number;
  remainingBudget: number;
  status: string;
  isPremium: boolean;
  createdAt: string;
  _count: { submissions: number };
}

export default function CreatorPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<CreatorTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'CREATOR' && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchTasks();
  }, [user, router]);

  const fetchTasks = async () => {
    try {
      const res = await taskApi.getCreatorTasks();
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'CREATOR' && user.role !== 'ADMIN')) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Tasks</h1>
            <button
              onClick={() => router.push('/creator/create')}
              className="bg-accent text-dark px-6 py-3 rounded-lg font-bold hover:bg-accent/90 flex items-center gap-2"
            >
              <Plus size={24} />
              Create Task
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="bg-darker border border-accent/10 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">No tasks created yet</p>
              <button
                onClick={() => router.push('/creator/create')}
                className="bg-accent text-dark px-6 py-2 rounded-lg font-bold hover:bg-accent/90"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-darker border border-accent/10 rounded-lg p-6 hover:border-accent/30 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{task.title}</h3>
                        {task.isPremium && (
                          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                            Premium
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            task.status === 'ACTIVE'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                        {task.description}
                      </p>
                      <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                        {task.type}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">Budget</p>
                      <p className="text-xl font-bold text-accent">
                        ${task.remainingBudget.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        of ${task.totalBudget.toFixed(2)}
                      </p>
                      <div className="mt-2 bg-dark rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{
                            width: `${((task.totalBudget - task.remainingBudget) / task.totalBudget) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-end justify-between md:justify-end gap-2">
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">${task.rewardPerTask.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{task._count.submissions} submissions</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg transition-all">
                          <Edit size={18} className="text-accent" />
                        </button>
                        <button className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg transition-all">
                          {task.status === 'ACTIVE' ? (
                            <Pause size={18} className="text-accent" />
                          ) : (
                            <Play size={18} className="text-accent" />
                          )}
                        </button>
                      </div>
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
