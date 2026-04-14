'use client';

import React from 'react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-dark to-darker">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Earn Money <span className="text-accent">Engaging on X</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Complete real X engagement tasks and earn USDC rewards. Join thousands of users earning passive income.
              </p>
              <div className="flex gap-4">
                <a
                  href="/register?role=USER"
                  className="bg-accent text-dark px-8 py-3 rounded-lg font-bold hover:bg-accent/90"
                >
                  Get Started
                </a>
                <a
                  href="#features"
                  className="border border-accent text-accent px-8 py-3 rounded-lg font-bold hover:bg-accent/10"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg border border-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-accent mb-4">💰</div>
                  <p className="text-gray-300">Quick & Easy Earnings</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-darker/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  title: 'Sign Up',
                  description: 'Create your account in seconds',
                  icon: '📝',
                },
                {
                  title: 'Browse Tasks',
                  description: 'Find engagement tasks that match your interests',
                  icon: '🔍',
                },
                {
                  title: 'Complete Tasks',
                  description: 'Follow, like, repost, quote or post on X',
                  icon: '✅',
                },
                {
                  title: 'Get Paid',
                  description: 'Earn USDC instantly to your wallet',
                  icon: '💎',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-dark border border-accent/10 p-6 rounded-lg hover:border-accent/30 transition-all"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-gray-300 mb-8">
              Join our community and start completing tasks today
            </p>
            <a
              href="/register?role=USER"
              className="bg-accent text-dark px-8 py-3 rounded-lg font-bold hover:bg-accent/90 inline-block"
            >
              Create Account Now
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-darker border-t border-accent/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <p>&copy; 2024 XTasker. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
