'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { taskApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Search } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: string;
  description: string;
  rewardPerTask: number;
  isPremium: boolean;
  creator: { username: string; avatarUrl?: string };
  _count: { submissions: number };
}

export default function TasksPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchTasks();
  }, [user, router, filter, typeFilter]);

  const fetchTasks = async () => {
    try {
      const params: any = {};
      if (typeFilter) params.type = typeFilter;
      if (filter) params.search = filter;

      const res = await taskApi.getAvailableTasks(params);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const taskTypes = ['FOLLOW', 'LIKE', 'REPOST', 'QUOTE', 'POST'];


  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Available Tasks</h1>

          {/* Filters */}
          <div className="bg-darker border border-accent/10 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-dark border border-accent/20 rounded-lg pl-10 pr-4 py-2 text-white focus:border-accent outline-none"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              >
                <option value="">All Task Types</option>
                {taskTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchTasks}
                className="bg-accent text-dark px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          {loading ? (
            <div className="text-center text-gray-400">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400">No tasks available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-darker border border-accent/10 hover:border-accent/30 rounded-lg p-6 transition-all cursor-pointer group"
                  onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {task.isPremium && (
                          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                            Premium
                          </span>
                        )}
                        <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                          {task.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-accent">
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-accent/10">
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        ${task.rewardPerTask.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task._count.submissions} submissions
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      by {task.creator.username}
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
