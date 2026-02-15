"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ScreenItem {
  id: string;
  number: number;
  title: string;
  status: "unread" | "review" | "done";
}

export interface WeekItem {
  id: string;
  number: number;
  title: string;
  screens: ScreenItem[];
  isCompleted: boolean;
  progress: number;
}

interface CourseSidebarProps {
  programmeId: string;
  courseId: string;
  courseName: string;
  weeks: WeekItem[];
}

function ScreenStatusIcon({ status }: { status: ScreenItem["status"] }) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-400" />;
    case "review":
      return <CircleDot className="h-4 w-4 flex-shrink-0 text-amber-400" />;
    default:
      return (
        <Circle className="h-4 w-4 flex-shrink-0 stroke-1.5 text-slate-500" />
      );
  }
}

export function CourseSidebar({
  programmeId,
  courseId,
  courseName,
  weeks,
}: CourseSidebarProps) {
  const pathname = usePathname();
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(
    new Set(weeks.map((w) => w.id))
  );

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  };

  const screenPath = (screenId: string) =>
    `/programmes/${programmeId}/courses/${courseId}/screens/${screenId}`;

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-[var(--surface-sidebar)] text-white">
      <div className="border-b border-slate-600/50 px-4 py-4">
        <Link
          href={`/programmes/${programmeId}`}
          className="mb-3 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Programme
        </Link>
        <h2 className="truncate text-lg font-semibold">{courseName}</h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {weeks.map((week) => {
            const isExpanded = expandedWeeks.has(week.id);
            const hasActiveScreen = week.screens.some((s) =>
              pathname.includes(screenPath(s.id))
            );

            return (
              <div key={week.id} className="rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleWeek(week.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    hasActiveScreen
                      ? "bg-slate-600/50 text-white"
                      : "text-slate-300 hover:bg-slate-600/30 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {week.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-400" />
                    ) : (
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-slate-500 text-xs">
                        {week.number}
                      </span>
                    )}
                    <span className="truncate">
                      Week {week.number}: {week.title}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-slate-400"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 border-l border-slate-600 pl-4 ml-3 py-1">
                        {week.screens.map((screen) => {
                          const isActive = pathname.includes(
                            screenPath(screen.id)
                          );
                          return (
                            <Link
                              key={screen.id}
                              href={screenPath(screen.id)}
                              className={`flex items-center gap-2 rounded py-1.5 pl-2 text-sm transition-colors ${
                                isActive
                                  ? "text-emerald-300"
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <ScreenStatusIcon status={screen.status} />
                              <span className="truncate">
                                {screen.number}. {screen.title}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
