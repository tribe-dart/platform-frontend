"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ChevronDown, ChevronUp, Loader2, TrendingUp, Award, Clock } from "lucide-react";

interface Grade {
  _id: string;
  userId: string;
  programmeId: string;
  courseId: {
    _id: string;
    title: string;
  };
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
  createdAt: string;
  updatedAt: string;
}

interface Programme {
  _id: string;
  title: string;
}

interface GradeStats {
  overallAverage: number;
  totalAssignments: number;
  gradedCount: number;
  pendingCount: number;
  notSubmittedCount: number;
}

const STATUS_STYLES: Record<string, string> = {
  graded: "bg-green-100 text-green-700",
  submitted: "bg-blue-100 text-blue-700",
  not_submitted: "bg-slate-100 text-slate-600",
  late: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  graded: "Graded",
  submitted: "Submitted",
  not_submitted: "Not Submitted",
  late: "Late",
};

export default function GradesPage() {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [stats, setStats] = useState<GradeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [programmeData, gradesData, statsData] = await Promise.all([
        apiFetch(`/programmes/${programmeId}`),
        apiFetch(`/grades/programme/${programmeId}`),
        apiFetch(`/grades/programme/${programmeId}/stats`),
      ]);
      setProgramme(programmeData);
      setGrades(gradesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load grades:', err);
    } finally {
      setLoading(false);
    }
  }, [programmeId]);

  useEffect(() => {
    if (programmeId) {
      loadData();
    }
  }, [programmeId, loadData]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
    { label: "Grades" },
  ];

  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-6 md:px-6">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Grades</h1>
        <p className="mt-1 text-slate-600">
          View your assessment results and feedback
        </p>
      </div>

      <div className="space-y-6 bg-slate-50 p-4 md:p-6">
        {stats && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <Award className="h-5 w-5 text-[var(--color-primary)]" />
              Grade Summary
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-gradient-to-br from-[var(--color-primary-light)] to-white p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
                  <p className="text-sm text-slate-600">Overall Average</p>
                </div>
                <p className="mt-2 text-3xl font-bold text-[var(--color-primary)]">
                  {stats.overallAverage}%
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-slate-600">Graded</p>
                <p className="mt-2 text-2xl font-semibold text-green-700">
                  {stats.gradedCount}
                </p>
                <p className="text-xs text-slate-500">of {stats.totalAssignments}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-slate-600">Submitted</p>
                <p className="mt-2 text-2xl font-semibold text-blue-700">
                  {stats.pendingCount}
                </p>
                <p className="text-xs text-slate-500">awaiting review</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Not Submitted</p>
                <p className="mt-2 text-2xl font-semibold text-slate-700">
                  {stats.notSubmittedCount}
                </p>
                <p className="text-xs text-slate-500">pending</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Overall Progress</span>
                <span className="text-slate-600">{stats.overallAverage}%</span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                  style={{ width: `${stats.overallAverage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {grades.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Award className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No grades yet
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Your grades will appear here as you complete and submit assessments
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Activity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="w-10 px-2 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <GradeRow
                      key={grade._id}
                      grade={grade}
                      isExpanded={expandedRows.has(grade._id)}
                      onToggle={() => toggleRow(grade._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GradeRow({
  grade,
  isExpanded,
  onToggle,
}: {
  grade: Grade;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusStyle = STATUS_STYLES[grade.status] ?? "bg-slate-100 text-slate-600";
  const statusLabel = STATUS_LABELS[grade.status] ?? grade.status;
  const scoreDisplay =
    grade.status === "graded" && grade.score !== undefined
      ? `${grade.score} / ${grade.maxScore}`
      : "—";
  
  const percentage = grade.status === "graded" && grade.score !== undefined
    ? Math.round((grade.score / grade.maxScore) * 100)
    : null;

  return (
    <>
      <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
        <td className="px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{grade.activityTitle}</p>
            <p className="text-xs text-slate-500 capitalize">{grade.activityType.replace('_', ' ')}</p>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-600">
          {grade.courseId.title}
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">{scoreDisplay}</p>
            {percentage !== null && (
              <p className="text-xs text-slate-500">{percentage}%</p>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-600">{grade.weight}%</td>
        <td className="px-4 py-3">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}
          >
            {statusLabel}
          </span>
        </td>
        <td className="px-2 py-3">
          {grade.feedback && (
            <button
              type="button"
              onClick={onToggle}
              className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </td>
      </tr>
      {grade.feedback && isExpanded && (
        <tr className="border-b border-slate-100 bg-slate-50/50">
          <td colSpan={6} className="px-4 py-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-700">Instructor Feedback</p>
                {grade.gradedBy && (
                  <p className="text-xs text-slate-500">
                    Graded by {grade.gradedBy.name}
                    {grade.gradedAt && ` on ${new Date(grade.gradedAt).toLocaleDateString()}`}
                  </p>
                )}
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{grade.feedback}</p>
              {grade.submittedAt && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  Submitted on {new Date(grade.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
