"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { getProgramme } from "@/lib/mock-data";
import { grades } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Grade } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  graded: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  submitted: "bg-emerald-100 text-emerald-700",
  late: "bg-red-100 text-red-700",
};

export default function GradesPage() {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const programme = getProgramme(programmeId);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const gradedGrades = grades.filter((g) => g.status === "graded" && g.score > 0);
  const totalWeight = grades.reduce((acc, g) => acc + g.weight, 0);
  const weightedSum = gradedGrades.reduce(
    (acc, g) => acc + (g.score / g.maxScore) * g.weight,
    0
  );
  const overallAverage =
    totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;
  const gradedCount = grades.filter((g) => g.status === "graded").length;
  const pendingCount = grades.filter((g) => g.status === "pending").length;

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Grade summary</h2>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <div>
              <p className="text-sm text-slate-500">Overall weighted average</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">
                {overallAverage}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Graded</p>
              <p className="text-xl font-semibold text-slate-900">
                {gradedCount} / {grades.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-semibold text-slate-900">
                {pendingCount}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Overall progress</span>
              <span className="text-slate-600">{overallAverage}%</span>
            </div>
            <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                style={{ width: `${overallAverage}%` }}
              />
            </div>
          </div>
        </div>

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
                    key={grade.id}
                    grade={grade}
                    isExpanded={expandedRows.has(grade.id)}
                    onToggle={() => toggleRow(grade.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
  const scoreDisplay =
    grade.status === "graded"
      ? `${grade.score} / ${grade.maxScore}`
      : "—";

  return (
    <>
      <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
        <td className="px-4 py-3 text-sm font-medium text-slate-900">
          {grade.activityTitle}
        </td>
        <td className="px-4 py-3 text-sm text-slate-600">
          {grade.courseTitle}
        </td>
        <td className="px-4 py-3 text-sm text-slate-700">{scoreDisplay}</td>
        <td className="px-4 py-3 text-sm text-slate-600">{grade.weight}%</td>
        <td className="px-4 py-3">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle}`}
          >
            {grade.status}
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
              <p className="text-sm font-medium text-slate-700">Feedback</p>
              <p className="mt-2 text-sm text-slate-600">{grade.feedback}</p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
