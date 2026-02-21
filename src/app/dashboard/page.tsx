'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { programmes, calendarEvents } from '@/lib/mock-data';
import type { Programme, CalendarEvent } from '@/types';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: date.getHours() !== 0 ? 'numeric' : undefined,
    minute: date.getMinutes() !== 0 ? '2-digit' : undefined,
  });
}

function ProgrammeCard({
  programme,
  index,
}: {
  programme: Programme;
  index: number;
}) {
  const inProgress = programme.courses.filter(
    (c) => c.status === 'in_progress'
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-2 bg-linear-to-r from-[#f46711] to-[#d4550d]" />
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900">{programme.title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{programme.institution}</p>

        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Progress</span>
            <span className="font-medium text-zinc-900">{programme.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${programme.progress}%` }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="h-full rounded-full bg-linear-to-r from-[#f46711] to-[#d4550d]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            {programme.courseCount} courses
          </span>
          <span className="text-xs text-zinc-500">
            {formatDate(programme.startDate)} – {formatDate(programme.endDate)}
          </span>
        </div>

        <Link
          href={`/programmes/${programme.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f46711] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#d4550d]"
        >
          Continue Learning
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function EventItem({ event }: { event: CalendarEvent }) {
  const typeColors: Record<string, string> = {
    live_class: 'bg-emerald-100 text-emerald-700',
    assignment: 'bg-amber-100 text-amber-700',
    quiz: 'bg-purple-100 text-purple-700',
    other: 'bg-zinc-100 text-zinc-700',
  };
  const colorClass = typeColors[event.type] ?? typeColors.other;

  return (
    <div className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-50">
      <div className="shrink-0">
        <div className={`rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}>
          {event.type.replace('_', ' ')}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900">
          {event.title}
        </p>
        <p className="text-xs text-zinc-500">
          {formatEventDate(event.startDate)}
          {event.courseTitle && ` · ${event.courseTitle}`}
        </p>
      </div>
    </div>
  );
}

function RecentActivityItem({
  title,
  time,
}: {
  title: string;
  time: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-50">
      <div className="h-2 w-2 shrink-0 rounded-full bg-[#f46711] mt-1.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-900">{title}</p>
        <p className="text-xs text-zinc-500">{time}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Handle redirects in useEffect to avoid setState during render
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.role === 'admin') {
      router.push('/admin');
    } else if (user?.role === 'instructor') {
      router.push('/instructor');
    }
  }, [isAuthenticated, user?.role, router]);

  // Show loading while redirecting
  if (!isAuthenticated || user?.role === 'admin' || user?.role === 'instructor') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f46711] border-t-transparent" />
      </div>
    );
  }

  const firstName = user?.firstName ?? 'there';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const coursesInProgress = programmes.reduce(
    (acc, p) =>
      acc + p.courses.filter((c) => c.status === 'in_progress').length,
    0
  );
  const upcomingDeadlines = calendarEvents.filter(
    (e) =>
      e.type === 'assignment' &&
      new Date(e.startDate) > new Date()
  ).length;

  const recentActivities = [
    { title: 'Completed Week 1 Knowledge Check', time: '2 hours ago' },
    { title: 'Watched: Introduction to Digital Transformation', time: 'Yesterday' },
    { title: 'Submitted Digital Maturity Assessment', time: '2 days ago' },
  ];

  const upcomingEvents = calendarEvents
    .filter((e) => new Date(e.startDate) >= new Date())
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl bg-linear-to-r from-[#f46711] to-[#d4550d] p-4 text-white mt-14 sm:mt-16 sm:p-6"
      >
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-0.5 text-sm text-white/90 sm:mt-1 sm:text-base">{today}</p>
        <div className="mt-3 flex flex-wrap gap-4 sm:mt-4 sm:gap-6">
          <div>
            <p className="text-xl font-semibold sm:text-2xl">{coursesInProgress}</p>
            <p className="text-xs text-white/80 sm:text-sm">Courses in progress</p>
          </div>
          <div>
            <p className="text-xl font-semibold sm:text-2xl">{upcomingDeadlines}</p>
            <p className="text-xs text-white/80 sm:text-sm">Upcoming deadlines</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:gap-8 lg:flex-row">
        {/* Main content - Programme cards */}
        <div className="flex-1">
          <h2 className="mb-3 text-base font-semibold text-zinc-900 sm:mb-4 sm:text-lg">
            Your Programmes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {programmes.map((programme, index) => (
              <ProgrammeCard key={programme.id} programme={programme} index={index} />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-full space-y-6 lg:w-80 lg:shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
              <Calendar className="h-5 w-5 text-[#f46711]" />
              Upcoming Events
            </h3>
            <div className="mt-4 space-y-1">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))
              ) : (
                <p className="py-4 text-center text-sm text-zinc-500">
                  No upcoming events
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <h3 className="font-semibold text-zinc-900">Recent Activity</h3>
            <div className="mt-4 space-y-1">
              {recentActivities.map((activity, i) => (
                <RecentActivityItem
                  key={i}
                  title={activity.title}
                  time={activity.time}
                />
              ))}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
