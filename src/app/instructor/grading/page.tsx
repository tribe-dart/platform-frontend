'use client';

import { useState } from 'react';
import { ArrowLeft, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  activityTitle: string;
  courseTitle: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  score?: number;
  maxScore: number;
}

const mockSubmissions: Submission[] = [
  {
    id: '1',
    studentName: 'John Smith',
    studentEmail: 'john@example.com',
    activityTitle: 'Digital Maturity Assessment',
    courseTitle: 'Digital Transformation Strategy',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    maxScore: 100,
  },
  {
    id: '2',
    studentName: 'Jane Doe',
    studentEmail: 'jane@example.com',
    activityTitle: 'Week 1 Knowledge Check',
    courseTitle: 'Digital Transformation Strategy',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'graded',
    score: 85,
    maxScore: 100,
  },
];

export default function InstructorGradingPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('all');

  const filteredSubmissions = mockSubmissions.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const pendingCount = mockSubmissions.filter((s) => s.status === 'pending').length;

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

        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All ({mockSubmissions.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('graded')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'graded'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Graded ({mockSubmissions.length - pendingCount})
          </button>
        </div>

        <div className="space-y-3">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  submission.status === 'pending'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {submission.status === 'pending' ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">{submission.studentName}</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      submission.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{submission.activityTitle}</p>
                <p className="text-xs text-slate-500">
                  {submission.courseTitle} • Submitted{' '}
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>

              {submission.status === 'graded' && (
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
                href={`/instructor/grading/${submission.id}`}
                className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                {submission.status === 'pending' ? 'Grade' : 'View'}
              </Link>
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No submissions to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
