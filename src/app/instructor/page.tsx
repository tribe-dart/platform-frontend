'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import {
  BookOpen,
  Users,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const instructorCards = [
  {
    title: 'My Programmes',
    description: 'View programmes you are teaching',
    icon: BookOpen,
    href: '/instructor/programmes',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Grade Submissions',
    description: 'Review and grade student assignments',
    icon: ClipboardCheck,
    href: '/instructor/grading',
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Students',
    description: 'View and manage your students',
    icon: Users,
    href: '/instructor/students',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Discussions',
    description: 'Moderate forums and discussions',
    icon: MessageSquare,
    href: '/instructor/discussions',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    title: 'Analytics',
    description: 'View student progress and engagement',
    icon: BarChart3,
    href: '/instructor/analytics',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    title: 'Schedule',
    description: 'Manage live classes and office hours',
    icon: Calendar,
    href: '/instructor/schedule',
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function InstructorDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Instructor Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Welcome back, {user?.firstName}. Manage your courses and students.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instructorCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--color-primary)]"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-primary)]" />
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
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Stats</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Active Students</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">-</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Pending Submissions</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">-</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Avg. Completion Rate</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">-</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Upcoming Classes</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
