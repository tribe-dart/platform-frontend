"use client";

import { use } from "react";
import Link from "next/link";
import { useProgressStore } from "@/stores/progressStore";
import { getCourse, getProgramme, getScreen } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ActivityCard } from "./ActivityCard";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, CircleDot, Clock } from "lucide-react";

interface ScreenPageProps {
  params: Promise<{ programmeId: string; courseId: string; screenId: string }>;
}

export default function ScreenPage({ params }: ScreenPageProps) {
  const { programmeId, courseId, screenId } = use(params);
  const screen = getScreen(screenId);
  const course = getCourse(courseId);
  const programme = getProgramme(programmeId);
  const setScreenStatus = useProgressStore((s) => s.setScreenStatus);
  const screenStatuses = useProgressStore((s) => s.screenStatuses);

  if (!screen || !course || !programme) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Screen not found</p>
      </div>
    );
  }

  const status = (screenStatuses[screen.id] ?? screen.status) as
    | "unread"
    | "review"
    | "done";

  const week = course.weeks.find((w) => w.id === screen.weekId);
  const weekNumber = week?.number ?? 0;
  const allScreens = course.weeks.flatMap((w) => w.screens);
  const currentIndex = allScreens.findIndex((s) => s.id === screenId);
  const prevScreen = currentIndex > 0 ? allScreens[currentIndex - 1] : null;
  const nextScreen =
    currentIndex >= 0 && currentIndex < allScreens.length - 1
      ? allScreens[currentIndex + 1]
      : null;
  const screenPosition = currentIndex + 1;
  const totalScreens = allScreens.length;

  const breadcrumbItems = [
    { label: programme.title, href: `/programmes/${programmeId}` },
    { label: course.title, href: `/programmes/${programmeId}/courses/${courseId}` },
    { label: `Week ${weekNumber}`, href: undefined },
    { label: screen.title, href: undefined },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:px-6 md:pb-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{screen.title}</h2>
          {screen.estimatedTime && (
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              <Clock className="h-4 w-4" />
              {screen.estimatedTime} min
            </span>
          )}
        </div>

        {/* Status controls */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["unread", "review", "done"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScreenStatus(screen.id, s)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                status === s
                  ? s === "done"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : s === "review"
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-400 bg-slate-100 text-slate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s === "done" && <CheckCircle2 className="h-4 w-4" />}
              {s === "review" && <CircleDot className="h-4 w-4" />}
              {s === "unread" && <Circle className="h-4 w-4 stroke-1.5" />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Narrative text */}
        {screen.narrativeText && (
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="leading-relaxed text-slate-700">
              {screen.narrativeText}
            </p>
          </div>
        )}

        {/* Activity Renderer */}
        <div className="space-y-6">
          {screen.activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:static md:mt-12 md:rounded-xl md:border md:shadow-sm">
        <div className="flex flex-1 items-center justify-between gap-4 md:max-w-3xl md:mx-auto md:px-0">
          {prevScreen ? (
            <Link
              href={`/programmes/${programmeId}/courses/${courseId}/screens/${prevScreen.id}`}
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden font-medium sm:inline">Previous</span>
            </Link>
          ) : (
            <div />

          )}

          <span className="text-sm font-medium text-slate-500">
            Screen {screenPosition} of {totalScreens}
          </span>

          {nextScreen ? (
            <Link
              href={`/programmes/${programmeId}/courses/${courseId}/screens/${nextScreen.id}`}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <span className="hidden sm:inline">Mark as Done & Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              href={`/programmes/${programmeId}/courses/${courseId}`}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <span className="hidden sm:inline">Mark as Done & Finish</span>
              <span className="sm:hidden">Finish</span>
              <CheckCircle2 className="h-5 w-5" />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
