"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { getProgramme } from "@/lib/mock-data";
import { calendarEvents } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/types";

const EVENT_TYPE_COLORS: Record<string, string> = {
  assignment: "bg-emerald-500",
  live_class: "bg-green-500",
  quiz: "bg-yellow-500",
  exam: "bg-red-500",
  deadline: "bg-red-500",
  other: "bg-slate-400",
};

export default function CalendarPage() {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const programme = getProgramme(programmeId);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { monthName, year, daysInMonth, firstDayOfMonth } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const firstDayOfMonth = first.getDay();
    const monthName = first.toLocaleString("default", { month: "long" });
    return { monthName, year, daysInMonth, firstDayOfMonth };
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    calendarEvents.forEach((ev) => {
      const dateKey = ev.startDate.slice(0, 10);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(ev);
    });
    return map;
  }, []);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return calendarEvents
      .filter((e) => e.startDate.slice(0, 10) >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 10);
  }, []);

  const goPrev = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  };
  const goNext = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));
  };
  const goToday = () => {
    setCurrentDate(new Date());
  };

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const todayStr = new Date().toISOString().slice(0, 10);

  if (!programme) return null;

  const breadcrumbItems = [
    { label: "Programmes", href: "/dashboard" },
    { label: programme.title, href: `/programmes/${programmeId}` },
    { label: "Calendar" },
  ];

  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-6 md:px-6">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Calendar</h1>
        <p className="mt-1 text-slate-600">
          View upcoming events and deadlines
        </p>
      </div>

      <div className="flex flex-col gap-6 bg-slate-50 p-4 md:p-6 lg:flex-row">
        <div className="flex-1">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <h2 className="min-w-[140px] text-lg font-semibold text-slate-900">
                  {monthName} {year}
                </h2>
              </div>
              <button
                type="button"
                onClick={goToday}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Today
              </button>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="py-2 text-xs font-medium text-slate-500"
                >
                  {d}
                </div>
              ))}
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} />;
                }
                const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const events = eventsByDate[dateKey] ?? [];
                const isToday = dateKey === todayStr;
                return (
                  <div
                    key={day}
                    className={`min-h-[80px] rounded-lg border p-2 ${
                      isToday
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isToday ? "text-[var(--color-primary)]" : "text-slate-700"
                      }`}
                    >
                      {day}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {events.slice(0, 2).map((ev) => (
                        <span
                          key={ev.id}
                          className={`inline-block h-2 w-2 rounded-full ${EVENT_TYPE_COLORS[ev.type] ?? "bg-slate-400"}`}
                          title={ev.title}
                        />
                      ))}
                      {events.length > 2 && (
                        <span className="text-xs text-slate-500">
                          +{events.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <h3 className="font-semibold text-slate-900">Upcoming events</h3>
            <div className="mt-4 space-y-3">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`rounded-lg border-l-4 bg-slate-50 p-3 ${
                    ev.type === "assignment"
                      ? "border-l-emerald-500"
                      : ev.type === "live_class"
                        ? "border-l-green-500"
                        : ev.type === "quiz"
                          ? "border-l-yellow-500"
                          : ev.type === "exam" || ev.type === "deadline"
                            ? "border-l-red-500"
                            : "border-l-slate-400"
                  }`}
                >
                  <p className="font-medium text-slate-900">{ev.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatEventDate(ev.startDate, ev.endDate)}
                  </p>
                  {ev.courseTitle && (
                    <p className="mt-1 text-xs text-slate-500">
                      {ev.courseTitle}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <h4 className="text-sm font-medium text-slate-700">
                Event type legend
              </h4>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Assignment
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Live class
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  Quiz
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Exam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatEventDate(start: string, end?: string): string {
  const startDate = new Date(start);
  const dateStr = startDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeStr = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (end) {
    const endDate = new Date(end);
    const endTimeStr = endDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr}, ${timeStr} – ${endTimeStr}`;
  }
  return `${dateStr}, ${timeStr}`;
}
