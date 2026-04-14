'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { LogOut, Menu } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-darker border-b border-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-accent">
            X<span className="text-white">Tasker</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            {!user ? (
              <>
                <Link href="/login" className="text-white hover:text-accent">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-accent text-dark px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-white hover:text-accent">
                  Dashboard
                </Link>
                {user.role === 'CREATOR' && (
                  <Link href="/creator" className="text-white hover:text-accent">
                    Creator
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-white hover:text-accent">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-sm">{user.username}</span>
                  <button
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 flex items-center gap-2"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-accent/10">
            {!user ? (
              <>
                <Link href="/login" className="block py-2 text-white hover:text-accent">
                  Login
                </Link>
                <Link href="/register" className="block py-2 text-white hover:text-accent">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block py-2 text-white hover:text-accent">
                  Dashboard
                </Link>
                {user.role === 'CREATOR' && (
                  <Link href="/creator" className="block py-2 text-white hover:text-accent">
                    Creator
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="block py-2 text-white hover:text-accent">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 text-red-400"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
