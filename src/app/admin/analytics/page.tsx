'use client';

import { ArrowLeft, BarChart3, TrendingUp, Users, BookOpen, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsAdminPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
          <p className="mt-1 text-slate-500">
            View platform usage and learning analytics
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">-</p>
            <p className="mt-1 text-xs text-slate-500">Coming soon</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">Active Programmes</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">-</p>
            <p className="mt-1 text-xs text-slate-500">Coming soon</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Activity className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">Enrollments</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">-</p>
            <p className="mt-1 text-xs text-slate-500">Coming soon</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">Completion Rate</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">-</p>
            <p className="mt-1 text-xs text-slate-500">Coming soon</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <BarChart3 className="mx-auto mb-4 h-16 w-16 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Analytics Dashboard Coming Soon
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Detailed analytics including user engagement, course completion rates, learning
            progress, and platform usage statistics will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
