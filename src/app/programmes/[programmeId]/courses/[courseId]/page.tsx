"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useProgressStore } from "@/stores/progressStore";
import { apiFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  FileQuestion,
  BookOpen,
  Video,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface CoursePageProps {
  params: Promise<{ programmeId: string; courseId: string }>;
}

interface Activity {
  id: string;
  title: string;
  type: string;
  isAssessed?: boolean;
  config?: Record<string, string | undefined>;
}

interface Screen {
  _id: string;
  title: string;
  estimatedTime?: number;
  activities: Activity[];
}

interface Week {
  _id: string;
  weekNumber: number;
  title: string;
  screens: Screen[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  weeks: Week[];
}

type TabId = "overview" | "assessment" | "reading" | "live" | "forum";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "assessment", label: "Assessment", icon: FileQuestion },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "live", label: "Live Classes", icon: Video },
  { id: "forum", label: "Forum", icon: MessageSquare },
];

function StatusBadge({
  status,
}: {
  status: "unread" | "review" | "done";
}) {
  switch (status) {
    case "done":
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Done
        </span>
      );
    case "review":
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
          <CircleDot className="h-3.5 w-3.5" />
          Review
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          <Circle className="h-3.5 w-3.5 stroke-1.5" />
          Unread
        </span>
      );
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const { programmeId, courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const screenStatuses = useProgressStore((s) => s.screenStatuses);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/courses/${courseId}`);
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Course not found</p>
      </div>
    );
  }

  const totalScreens = course.weeks.reduce((acc, w) => acc + w.screens.length, 0);
  const completedCount = course.weeks.reduce(
    (acc, w) =>
      acc +
      w.screens.filter(
        (s) => (screenStatuses[s._id] ?? 'unread') === "done"
      ).length,
    0
  );

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) next.delete(weekId);
      else next.add(weekId);
      return next;
    });
  };

  const assessedActivities = course.weeks.flatMap((week) =>
    week.screens.flatMap((screen) =>
      (screen.activities || [])
        .filter((a) => a.isAssessed)
        .map((a) => ({ ...a, screen, week }))
    )
  );

  const liveClassActivities = course.weeks.flatMap((week) =>
    week.screens.flatMap((screen) =>
      (screen.activities || [])
        .filter((a) => a.type === "live_class")
        .map((a) => ({ ...a, screen, week }))
    )
  );

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8 md:px-6">
      {/* Course header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">
          {course.title}
        </h1>
        <p className="mb-4 text-slate-600">{course.description}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 sm:text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {completedCount} of {totalScreens} screens completed
          </div>
          <div className="h-2 flex-1 rounded-full bg-slate-200 sm:max-w-xs">
            <motion.div
              className="h-full rounded-full bg-(--color-primary)"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedCount / totalScreens) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 pb-px scrollable-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === id
                ? "border-(--color-primary) text-(--color-primary)"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {course.weeks.map((week) => {
              const isExpanded = expandedWeeks.has(week._id);
              const weekCompleted = week.screens.filter(
                (s) => (screenStatuses[s._id] ?? 'unread') === "done"
              ).length;
              const weekTotal = week.screens.length;
              const weekProgress =
                weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0;

              return (
                <div
                  key={week._id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleWeek(week._id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {week.weekNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900">
                          Week {week.weekNumber}: {week.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-3">
                          <div className="h-1.5 flex-1 max-w-[120px] rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-(--color-primary)"
                              style={{ width: `${weekProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {weekCompleted}/{weekTotal} completed
                          </span>
                          {weekCompleted === weekTotal && weekTotal > 0 && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      className="shrink-0 text-slate-400"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-slate-100"
                      >
                        <ul className="divide-y divide-slate-100">
                          {week.screens.map((screen, screenIndex) => {
                            const status = (screenStatuses[screen._id] ?? 'unread') as "unread" | "review" | "done";
                            return (
                              <li key={screen._id}>
                                <Link
                                  href={`/programmes/${programmeId}/courses/${courseId}/screens/${screen._id}`}
                                  className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-slate-50"
                                >
                                  <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <StatusBadge status={status} />
                                    <span className="text-sm font-medium text-slate-800">
                                      {screenIndex + 1}. {screen.title}
                                    </span>
                                  </div>
                                  {screen.estimatedTime && (
                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                      <Clock className="h-3.5 w-3.5" />
                                      {screen.estimatedTime} min
                                    </span>
                                  )}
                                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === "assessment" && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {assessedActivities.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No assessed activities in this course yet.
              </div>
            ) : (
              assessedActivities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/programmes/${programmeId}/courses/${courseId}/screens/${activity.screen._id}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{activity.title}</h4>
                      <p className="text-sm text-slate-500">
                        Week {activity.week.weekNumber} · {activity.screen.title}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </Link>
              ))
            )}
          </motion.div>
        )}

        {activeTab === "reading" && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500"
          >
            Reading materials are integrated into the course screens. Navigate
            through the Overview to access them.
          </motion.div>
        )}

        {activeTab === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {liveClassActivities.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No live classes scheduled for this course.
              </div>
            ) : (
              liveClassActivities.map((activity) => {
                const cfg = activity.config as {
                  date?: string;
                  time?: string;
                  platform?: string;
                  link?: string;
                };
                return (
                  <div
                    key={activity.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <h4 className="font-medium text-slate-900">{activity.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {cfg.date} · {cfg.time} · {cfg.platform}
                    </p>
                    {cfg.link && (
                      <a
                        href={cfg.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--color-primary-hover)"
                      >
                        Join session
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {activeTab === "forum" && (
          <motion.div
            key="forum"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500"
          >
            Course forum and discussions will appear here.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
