'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    xHandle: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const res = await authApi.getCurrentUser();
      setProfile(res.data);
      setFormData({
        xHandle: res.data.xHandle || '',
        bio: res.data.bio || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // In a real app, you would have an updateProfile endpoint
      alert('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Profile</h1>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <div className="bg-darker border border-accent/10 rounded-lg p-8">
              <div className="space-y-6">
                {/* Account Info (Read-only) */}
                <div className="border-b border-accent/10 pb-6">
                  <h3 className="text-lg font-bold mb-4">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Username</label>
                      <p className="text-white font-medium mt-1">{profile?.username}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white font-medium mt-1">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Role</label>
                      <p className="text-white font-medium mt-1">
                        {profile?.role === 'USER' ? 'Task Completer' : profile?.role}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Member Since</label>
                      <p className="text-white font-medium mt-1">
                        {new Date(profile?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* X Profile & Bio */}
                <div>
                  <h3 className="text-lg font-bold mb-4">X Profile</h3>
                  {!editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm">X Handle</label>
                        <p className="text-white font-medium mt-1">
                          {profile?.xHandle ? `@${profile.xHandle}` : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Bio</label>
                        <p className="text-white font-medium mt-1">
                          {profile?.bio || 'No bio'}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Premium Account</label>
                        <p className="text-white font-medium mt-1">
                          {profile?.isPremiumAccount ? (
                            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded inline-block">
                              ✓ Premium
                            </span>
                          ) : (
                            <span className="text-gray-400">Standard</span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-accent text-dark px-6 py-2 rounded-lg font-medium hover:bg-accent/90"
                      >
                        Edit Profile
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm">X Handle (without @)</label>
                        <input
                          type="text"
                          value={formData.xHandle}
                          onChange={(e) =>
                            setFormData({ ...formData, xHandle: e.target.value })
                          }
                          className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none mt-2"
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none mt-2 resize-none"
                          rows={4}
                          placeholder="Tell about yourself"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleSave}
                          className="bg-accent text-dark px-6 py-2 rounded-lg font-medium hover:bg-accent/90"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              xHandle: profile?.xHandle || '',
                              bio: profile?.bio || '',
                            });
                          }}
                          className="border border-accent text-accent px-6 py-2 rounded-lg font-medium hover:bg-accent/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="border-t border-accent/10 pt-6">
                  <h3 className="text-lg font-bold mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Total Earned</label>
                      <p className="text-2xl font-bold text-accent mt-1">
                        ${profile?.totalEarned.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Current Balance</label>
                      <p className="text-2xl font-bold text-green-400 mt-1">
                        ${profile?.walletBalance.toFixed(2)}
                      </p>
                    </div>
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
