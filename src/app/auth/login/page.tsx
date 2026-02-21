'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, mustChangePassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      if (mustChangePassword) {
        router.push('/auth/change-password');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col justify-center bg-white px-5 py-10 sm:px-8 sm:py-16 md:w-1/2 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-md">
          <div className="mb-6">
            <Image
              src="/cropped-LOGO-300x93.png"
              alt="Innov8ive Academy"
              width={300}
              height={93}
              priority
              className="h-auto w-48 sm:w-64"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg md:text-xl"
          >
            Transform your career with world-class education
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-8 sm:px-6 sm:py-12 md:px-12"
      >
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">Welcome back</h2>
            <p className="mt-1 text-zinc-600">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="mt-1.5 block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-[#f46711] focus:outline-none focus:ring-1 focus:ring-[#f46711]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-lg border border-zinc-300 px-4 py-2.5 pr-10 text-zinc-900 placeholder-zinc-400 focus:border-[#f46711] focus:outline-none focus:ring-1 focus:ring-[#f46711]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-[#f46711] focus:ring-[#f46711]"
                  />
                  <span className="text-sm text-zinc-600">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[#f46711] hover:text-[#d4550d]"
                >
                  Forgot password?
                </Link>
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
                disabled={isLoading}
                className="w-full rounded-lg bg-[#f46711] px-4 py-3 font-medium text-white transition-colors hover:bg-[#d4550d] focus:outline-none focus:ring-2 focus:ring-[#f46711] focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
