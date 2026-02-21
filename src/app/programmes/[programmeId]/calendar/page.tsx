"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, MapPin, Video, Plus, X, Clock, BookOpen } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  type: 'assignment' | 'live_class' | 'quiz' | 'exam' | 'deadline' | 'other';
  startDate: string;
  endDate?: string;
  programmeId: string;
  courseId?: {
    _id: string;
    title: string;
  };
  location?: string;
  meetingLink?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Programme {
  _id: string;
  title: string;
}

interface Course {
  _id: string;
  title: string;
}

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
  const { user } = useAuthStore();
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [programmeData, eventsData, coursesData] = await Promise.all([
        apiFetch(`/programmes/${programmeId}`),
        apiFetch(`/calendar-events?programmeId=${programmeId}`),
        apiFetch(`/courses?programmeId=${programmeId}`),
      ]);
      setProgramme(programmeData);
      setEvents(eventsData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Failed to load calendar:', err);
    } finally {
      setLoading(false);
    }
  }, [programmeId]);

  useEffect(() => {
    if (programmeId) {
      loadData();
    }
  }, [programmeId, loadData]);

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
    events.forEach((ev) => {
      const dateKey = ev.startDate.slice(0, 10);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(ev);
    });
    return map;
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return events
      .filter((e) => e.startDate.slice(0, 10) >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 10);
  }, [events]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

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
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
            <p className="mt-1 text-slate-600">
              View upcoming events and deadlines
            </p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowEventModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </button>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3"
          >
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-xs font-medium text-red-600 hover:text-red-700"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3"
          >
            <p className="text-sm text-green-800">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-1 text-xs font-medium text-green-600 hover:text-green-700"
            >
              Dismiss
            </button>
          </motion.div>
        )}
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
                const dayEvents = eventsByDate[dateKey] ?? [];
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
                      {dayEvents.slice(0, 2).map((ev) => (
                        <span
                          key={ev._id}
                          className={`inline-block h-2 w-2 rounded-full ${EVENT_TYPE_COLORS[ev.type] ?? "bg-slate-400"}`}
                          title={ev.title}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-xs text-slate-500">
                          +{dayEvents.length - 2}
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
              {upcomingEvents.length === 0 ? (
                <div className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No upcoming events scheduled
                </div>
              ) : (
                upcomingEvents.map((ev) => (
                  <div
                    key={ev._id}
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
                    {ev.description && (
                      <p className="mt-1 text-sm text-slate-600">{ev.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {formatEventDate(ev.startDate, ev.endDate)}
                    </div>
                    {ev.courseId && (
                      <p className="mt-1 text-xs text-slate-500">
                        {ev.courseId.title}
                      </p>
                    )}
                    {ev.location && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {ev.location}
                      </div>
                    )}
                    {ev.meetingLink && (
                      <a
                        href={ev.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:underline"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Join meeting
                      </a>
                    )}
                  </div>
                ))
              )}
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

      {showEventModal && (
        <QuickEventModal
          programmeId={programmeId}
          programmeName={programme.title}
          courses={courses}
          onClose={() => setShowEventModal(false)}
          onSuccess={(message) => {
            setSuccess(message);
            setShowEventModal(false);
            loadData();
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

function QuickEventModal({
  programmeId,
  programmeName,
  courses,
  onClose,
  onSuccess,
  onError,
}: {
  programmeId: string;
  programmeName: string;
  courses: Course[];
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}) {
  const EVENT_TYPE_LABELS: Record<string, string> = {
    assignment: 'Assignment',
    live_class: 'Live Class',
    quiz: 'Quiz',
    exam: 'Exam',
    deadline: 'Deadline',
    other: 'Other',
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'assignment' as const,
    startDate: '',
    endDate: '',
    courseId: '',
    location: '',
    meetingLink: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.startDate) {
      onError('Title and start date are required');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        programmeId,
        courseId: formData.courseId || undefined,
        endDate: formData.endDate || undefined,
        location: formData.location || undefined,
        meetingLink: formData.meetingLink || undefined,
      };

      await apiFetch('/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      onSuccess('Event created successfully');
    } catch (err: any) {
      onError(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">Add Calendar Event</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
            Programme: <span className="font-medium">{programmeName}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              >
                {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description (optional)"
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Course (Optional)
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                <option value="">All courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location (for physical events)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Room 101, Building A"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Meeting Link (for virtual events)
              </label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://zoom.us/j/..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
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
