'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { isAuthenticated, mustChangePassword, token, logout } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      const data = await response.json();

      // Update token if a new one was issued
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }

      // Show success and redirect
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col justify-center bg-white px-8 py-16 md:w-1/2 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-md">
          <div className="mb-6">
            <Image
              src="/cropped-LOGO-300x93.png"
              alt="Innov8ive Academy"
              width={300}
              height={93}
              priority
              className="h-auto w-64"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-lg text-slate-600 md:text-xl"
          >
            Secure your account with a new password
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12 md:px-12"
      >
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            {mustChangePassword && (
              <div className="mb-6 flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <Lock className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Password change required
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    For security, you must change your temporary password before continuing.
                  </p>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-zinc-900">Change Password</h2>
            <p className="mt-1 text-zinc-600">Create a new secure password</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Current Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 pr-10 text-zinc-900 placeholder-zinc-400 focus:border-[#f46711] focus:outline-none focus:ring-1 focus:ring-[#f46711]"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-zinc-700"
                >
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 pr-10 text-zinc-900 placeholder-zinc-400 focus:border-[#f46711] focus:outline-none focus:ring-1 focus:ring-[#f46711]"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {newPassword && newPassword.length < 8 && (
                  <p className="mt-1 text-xs text-amber-600">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Confirm New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 pr-10 text-zinc-900 placeholder-zinc-400 focus:border-[#f46711] focus:outline-none focus:ring-1 focus:ring-[#f46711]"
                    placeholder="Re-enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                className="w-full rounded-lg bg-[#f46711] px-4 py-3 font-medium text-white transition-colors hover:bg-[#d4550d] focus:outline-none focus:ring-2 focus:ring-[#f46711] focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/auth/login');
                }}
                className="text-sm text-zinc-500 hover:text-zinc-700"
              >
                Cancel and sign out
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
