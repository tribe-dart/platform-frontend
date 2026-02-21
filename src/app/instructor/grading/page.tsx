'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, FileText, Clock, CheckCircle2, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface Submission {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  courseId: {
    _id: string;
    title: string;
  };
  activityTitle: string;
  activityType: string;
  submittedAt?: string;
  status: 'not_submitted' | 'submitted' | 'graded' | 'late';
  score?: number;
  maxScore: number;
  weight: number;
}

interface Programme {
  _id: string;
  title: string;
}

interface Course {
  _id: string;
  title: string;
}

export default function InstructorGradingPage() {
  const { user } = useAuthStore();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'graded'>('all');
  const [search, setSearch] = useState('');

  const loadProgrammes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/programmes');
      setProgrammes(data);
      if (data.length > 0) {
        setSelectedProgramme(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load programmes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCourses = useCallback(async () => {
    if (!selectedProgramme) return;
    try {
      const data = await apiFetch(`/programmes/${selectedProgramme}`);
      setCourses(data.courses || []);
      if (data.courses && data.courses.length > 0) {
        setSelectedCourse(data.courses[0]._id);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  }, [selectedProgramme]);

  const loadSubmissions = useCallback(async () => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      const data = await apiFetch(`/grades/course/${selectedCourse}/submissions`);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    loadProgrammes();
  }, [loadProgrammes]);

  useEffect(() => {
    if (selectedProgramme) {
      loadCourses();
    }
  }, [selectedProgramme, loadCourses]);

  useEffect(() => {
    if (selectedCourse) {
      loadSubmissions();
    }
  }, [selectedCourse, loadSubmissions]);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter !== 'all' && sub.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        sub.userId.name.toLowerCase().includes(searchLower) ||
        sub.userId.email.toLowerCase().includes(searchLower) ||
        sub.activityTitle.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const submittedCount = submissions.filter((s) => s.status === 'submitted').length;
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;

  if (loading && programmes.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/instructor"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Instructor Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Grade Submissions</h1>
          <p className="mt-1 text-slate-500">
            Review and grade student assignments
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Programme
              </label>
              <select
                value={selectedProgramme}
                onChange={(e) => setSelectedProgramme(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                {programmes.map((prog) => (
                  <option key={prog._id} value={prog._id}>
                    {prog.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, email, or activity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('submitted')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'submitted'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Pending ({submittedCount})
            </button>
            <button
              onClick={() => setFilter('graded')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === 'graded'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Graded ({gradedCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    submission.status === 'submitted'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {submission.status === 'submitted' ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{submission.userId.name}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        submission.status === 'submitted'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{submission.activityTitle}</p>
                  <p className="text-xs text-slate-500">
                    {submission.courseId.title}
                    {submission.submittedAt && (
                      <> • Submitted {new Date(submission.submittedAt).toLocaleString()}</>
                    )}
                  </p>
                </div>

                {submission.status === 'graded' && submission.score !== undefined && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {submission.score}
                      <span className="text-base font-normal text-slate-500">
                        /{submission.maxScore}
                      </span>
                    </p>
                  </div>
                )}

                <Link
                  href={`/instructor/grading/${submission._id}`}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  {submission.status === 'submitted' ? 'Grade' : 'View'}
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredSubmissions.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No submissions to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
