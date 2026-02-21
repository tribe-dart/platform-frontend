'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import {
  Users,
  Package,
  Mail,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  ArrowRight,
  Newspaper,
  Calendar,
  Loader2,
} from 'lucide-react';

const adminCards = [
  {
    title: 'User Management',
    description: 'Create, edit, and manage user accounts',
    icon: Users,
    href: '/admin/users',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Programme Enrollment',
    description: 'Assign students and instructors to programmes',
    icon: GraduationCap,
    href: '/admin/enrollments',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Invitations',
    description: 'Send and manage programme invitations',
    icon: Mail,
    href: '/admin/invitations',
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'SCORM Packages',
    description: 'Upload and manage SCORM learning content',
    icon: Package,
    href: '/admin/scorm',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Programmes',
    description: 'Create and manage learning programmes',
    icon: BookOpen,
    href: '/admin/programmes',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    title: 'News & Announcements',
    description: 'Post updates and news for programmes',
    icon: Newspaper,
    href: '/admin/news',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Calendar Events',
    description: 'Manage events, deadlines, and live classes',
    icon: Calendar,
    href: '/admin/calendar',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    title: 'Analytics',
    description: 'View platform usage and learning analytics',
    icon: BarChart3,
    href: '/admin/analytics',
    color: 'bg-pink-100 text-pink-600',
  },
];

interface AdminStats {
  totalUsers: number;
  activeProgrammes: number;
  totalEnrollments: number;
  pendingInvitations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiFetch('/stats/admin');
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Manage users, programmes, content, and platform settings
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-(--color-primary)"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-(--color-primary)" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{card.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-900">Quick Stats</h2>
          </div>
          {loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats?.totalUsers ?? '-'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Active Programmes</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats?.activeProgrammes ?? '-'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Total Enrollments</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats?.totalEnrollments ?? '-'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Pending Invitations</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stats?.pendingInvitations ?? '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
