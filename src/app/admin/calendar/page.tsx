'use client';

import { useState, useCallback, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, ArrowLeft, Loader2, X, Clock, MapPin, Video, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface Programme {
  _id: string;
  title: string;
  institution: string;
}

interface Course {
  _id: string;
  title: string;
}

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

const EVENT_TYPE_LABELS: Record<string, string> = {
  assignment: 'Assignment',
  live_class: 'Live Class',
  quiz: 'Quiz',
  exam: 'Exam',
  deadline: 'Deadline',
  other: 'Other',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  assignment: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  live_class: 'bg-green-100 text-green-700 border-green-200',
  quiz: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  exam: 'bg-red-100 text-red-700 border-red-200',
  deadline: 'bg-red-100 text-red-700 border-red-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function CalendarAdminPage() {
  const searchParams = useSearchParams();
  const preselectedProgrammeId = searchParams.get('programme');

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>(preselectedProgrammeId || '');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const loadProgrammes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/programmes');
      setProgrammes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load programmes');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCourses = useCallback(async (programmeId: string) => {
    if (!programmeId) return;
    try {
      const data = await apiFetch(`/courses?programmeId=${programmeId}`);
      setCourses(data);
    } catch (err: any) {
      console.error('Failed to load courses:', err);
    }
  }, []);

  const loadEvents = useCallback(async (programmeId: string) => {
    if (!programmeId) return;
    try {
      setLoadingEvents(true);
      const data = await apiFetch(`/calendar-events?programmeId=${programmeId}`);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    loadProgrammes();
  }, [loadProgrammes]);

  useEffect(() => {
    if (selectedProgrammeId) {
      loadEvents(selectedProgrammeId);
      loadCourses(selectedProgrammeId);
    } else {
      setEvents([]);
      setCourses([]);
    }
  }, [selectedProgrammeId, loadEvents, loadCourses]);

  const handleDelete = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await apiFetch(`/calendar-events/${eventId}`, { method: 'DELETE' });
      setSuccess('Event deleted successfully');
      loadEvents(selectedProgrammeId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
    }
  };

  const selectedProgramme = programmes.find((p) => p._id === selectedProgrammeId);

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <Calendar className="h-7 w-7 text-[var(--color-primary)]" />
                Calendar Event Management
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Create and manage programme events, deadlines, and live classes
              </p>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4"
          >
            <p className="text-sm text-green-800">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-2 text-sm font-medium text-green-600 hover:text-green-700"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Programme
          </label>
          <select
            value={selectedProgrammeId}
            onChange={(e) => setSelectedProgrammeId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            <option value="">Choose a programme...</option>
            {programmes.map((prog) => (
              <option key={prog._id} value={prog._id}>
                {prog.title} - {prog.institution}
              </option>
            ))}
          </select>
        </div>

        {selectedProgrammeId && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Events for {selectedProgramme?.title}
              </h2>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                <Plus className="h-4 w-4" />
                Create Event
              </button>
            </div>

            {loadingEvents ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No events scheduled
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Create your first event to help students track deadlines and live classes
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedEvents.map((event) => (
                  <div
                    key={event._id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              EVENT_TYPE_COLORS[event.type]
                            }`}
                          >
                            {EVENT_TYPE_LABELS[event.type]}
                          </span>
                          {event.courseId && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <BookOpen className="h-3 w-3" />
                              {event.courseId.title}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{event.title}</h3>
                        {event.description && (
                          <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {formatEventDate(event.startDate, event.endDate)}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          )}
                          {event.meetingLink && (
                            <a
                              href={event.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[var(--color-primary)] hover:underline"
                            >
                              <Video className="h-4 w-4" />
                              Meeting link
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowModal(true);
                          }}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id, event.title)}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <EventModal
          event={editingEvent}
          programmeId={selectedProgrammeId}
          programmeName={selectedProgramme?.title || ''}
          courses={courses}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }}
          onSuccess={(message) => {
            setSuccess(message);
            setShowModal(false);
            setEditingEvent(null);
            loadEvents(selectedProgrammeId);
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

function EventModal({
  event,
  programmeId,
  programmeName,
  courses,
  onClose,
  onSuccess,
  onError,
}: {
  event: CalendarEvent | null;
  programmeId: string;
  programmeName: string;
  courses: Course[];
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    type: event?.type || 'other' as const,
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    courseId: event?.courseId?._id || '',
    location: event?.location || '',
    meetingLink: event?.meetingLink || '',
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

      if (event) {
        await apiFetch(`/calendar-events/${event._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        onSuccess('Event updated successfully');
      } else {
        await apiFetch('/calendar-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        onSuccess('Event created successfully');
      }
    } catch (err: any) {
      onError(err.message || 'Failed to save event');
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
          <h2 className="text-xl font-semibold text-slate-900">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
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

            <div className="grid grid-cols-2 gap-4">
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
                Location
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
                Meeting Link
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
                  Saving...
                </>
              ) : (
                <>{event ? 'Update' : 'Create'} Event</>
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
  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  if (end) {
    const endDate = new Date(end);
    const endTimeStr = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dateStr}, ${timeStr} – ${endTimeStr}`;
  }
  
  return `${dateStr}, ${timeStr}`;
}
