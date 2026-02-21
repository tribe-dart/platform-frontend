'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Loader2, Save, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Grade {
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
  programmeId: string;
  screenId: string;
  activityId: string;
  activityTitle: string;
  activityType: string;
  submissionUrl?: string;
  submissionText?: string;
  submittedAt?: string;
  score?: number;
  maxScore: number;
  weight: number;
  status: 'not_submitted' | 'submitted' | 'graded' | 'late';
  feedback?: string;
  gradedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  gradedAt?: string;
}

interface GradeDetailPageProps {
  params: Promise<{ gradeId: string }>;
}

export default function GradeDetailPage({ params }: GradeDetailPageProps) {
  const { gradeId } = use(params);
  const router = useRouter();
  const [grade, setGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadGrade = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/grades/course/${gradeId}`);
      setGrade(data);
      setScore(data.score?.toString() || '');
      setFeedback(data.feedback || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load submission');
    } finally {
      setLoading(false);
    }
  }, [gradeId]);

  useEffect(() => {
    loadGrade();
  }, [loadGrade]);

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > (grade?.maxScore || 100)) {
      setError(`Score must be between 0 and ${grade?.maxScore || 100}`);
      return;
    }

    try {
      setSaving(true);
      await apiFetch(`/grades/${gradeId}/grade`, {
        method: 'PUT',
        body: JSON.stringify({ score: scoreNum, feedback }),
      });
      setSuccess('Grade saved successfully');
      setTimeout(() => {
        router.push('/instructor/grading');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!grade) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Submission not found</h2>
          <Link
            href="/instructor/grading"
            className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Grading
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/instructor/grading"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Grading
        </Link>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">{grade.activityTitle}</h1>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Student</p>
                <p className="mt-1 font-medium text-slate-900">{grade.userId.name}</p>
                <p className="text-sm text-slate-600">{grade.userId.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Course</p>
                <p className="mt-1 font-medium text-slate-900">{grade.courseId.title}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Activity Type</p>
                <p className="mt-1 font-medium text-slate-900 capitalize">
                  {grade.activityType.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Submitted</p>
                <p className="mt-1 font-medium text-slate-900">
                  {grade.submittedAt
                    ? new Date(grade.submittedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Not submitted'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Max Score</p>
                <p className="mt-1 font-medium text-slate-900">{grade.maxScore} points</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Weight</p>
                <p className="mt-1 font-medium text-slate-900">{grade.weight}%</p>
              </div>
            </div>
          </div>

          {grade.submissionText && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Submission Text</h2>
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {grade.submissionText}
                </p>
              </div>
            </div>
          )}

          {grade.submissionUrl && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">Submission File</h2>
              <a
                href={grade.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <ExternalLink className="h-4 w-4" />
                View Submission
              </a>
            </div>
          )}

          <form onSubmit={handleSubmitGrade} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Grade Submission</h2>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="score" className="block text-sm font-medium text-slate-700">
                  Score (out of {grade.maxScore})
                </label>
                <input
                  type="number"
                  id="score"
                  min="0"
                  max={grade.maxScore}
                  step="0.5"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-slate-700">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Grade
                    </>
                  )}
                </button>
                <Link
                  href="/instructor/grading"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>

          {grade.status === 'graded' && grade.gradedBy && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Previously graded by {grade.gradedBy.name}
              {grade.gradedAt && ` on ${new Date(grade.gradedAt).toLocaleDateString()}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
