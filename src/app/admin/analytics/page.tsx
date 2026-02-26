'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Activity, 
  TrendingUp,
  GraduationCap,
  Package,
  BarChart3,
  Loader2,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import Link from 'next/link';

interface Analytics {
  users: {
    total: number;
    byRole: { admin: number; instructor: number; student: number };
  };
  programmes: {
    total: number;
    byStatus: { active: number; draft: number; archived: number };
  };
  enrollments: {
    total: number;
    byRole: { student: number; instructor: number; ta: number };
  };
  scorm: {
    totalPackages: number;
    completions: number;
    completionRate: number;
  };
  grades: {
    total: number;
    avgScore: number;
    submitted: number;
    graded: number;
  };
  recentActivity: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
  }>;
}

export default function AnalyticsAdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await apiFetch('/stats/analytics');
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-[var(--surface-bg)] p-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-800">Failed to load analytics</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Overview Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.users.total}</p>
            <div className="mt-2 flex gap-2 text-xs text-slate-500">
              <span>{analytics.users.byRole.student} students</span>
              <span>•</span>
              <span>{analytics.users.byRole.instructor} instructors</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">Programmes</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.programmes.total}</p>
            <div className="mt-2 flex gap-2 text-xs text-slate-500">
              <span>{analytics.programmes.byStatus.active} active</span>
              <span>•</span>
              <span>{analytics.programmes.byStatus.draft} draft</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">Enrollments</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.enrollments.total}</p>
            <div className="mt-2 flex gap-2 text-xs text-slate-500">
              <span>{analytics.enrollments.byRole.student} students</span>
              <span>•</span>
              <span>{analytics.enrollments.byRole.instructor} instructors</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">SCORM Completion</p>
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.scorm.completionRate}%</p>
            <div className="mt-2 flex gap-2 text-xs text-slate-500">
              <span>{analytics.scorm.completions} of {analytics.scorm.totalPackages} completed</span>
            </div>
          </div>
        </div>

        {/* Learning Analytics */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Package className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">SCORM Modules</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Total Packages</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.scorm.totalPackages}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Completions</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.scorm.completions}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.scorm.completionRate}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Grading Overview</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-slate-700">Total Assignments</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.grades.total}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">Pending Grading</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.grades.submitted}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Average Score</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{analytics.grades.avgScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">User Distribution</h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Students</span>
                  <span className="text-sm font-semibold text-slate-900">{analytics.users.byRole.student}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${(analytics.users.byRole.student / analytics.users.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Instructors</span>
                  <span className="text-sm font-semibold text-slate-900">{analytics.users.byRole.instructor}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width: `${(analytics.users.byRole.instructor / analytics.users.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Admins</span>
                  <span className="text-sm font-semibold text-slate-900">{analytics.users.byRole.admin}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${(analytics.users.byRole.admin / analytics.users.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Programme Status</h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Active</span>
                  <span className="text-sm font-semibold text-slate-900">{analytics.programmes.byStatus.active}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${(analytics.programmes.byStatus.active / analytics.programmes.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Draft</span>
                  <span className="text-sm font-semibold text-slate-900">{analytics.programmes.byStatus.draft}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${(analytics.programmes.byStatus.draft / analytics.programmes.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Archived</span>
                  <span className="text-sm font-semibold text-slate-900">{analytics.programmes.byStatus.archived}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-400"
                    style={{
                      width: `${(analytics.programmes.byStatus.archived / analytics.programmes.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <Activity className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
          </div>
          {analytics.recentActivity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left text-sm font-medium text-slate-600">Name</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-600">Email</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-600">Role</th>
                    <th className="pb-3 text-left text-sm font-medium text-slate-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentActivity.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 text-sm text-slate-900">{user.name}</td>
                      <td className="py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === 'admin' ? 'bg-green-100 text-green-700' :
                          user.role === 'instructor' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-slate-600">
                        {new Date(user.joinedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500 py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
