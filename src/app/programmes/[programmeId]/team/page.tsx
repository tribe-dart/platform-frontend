"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Search, MapPin, Loader2, Mail } from "lucide-react";

type FilterTab = "all" | "students" | "instructors" | "tas";

interface Programme {
  _id: string;
  title: string;
}

interface TeamMember {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  role: 'student' | 'instructor' | 'ta';
  status: string;
  enrolledAt: string;
}

export default function TeamPage() {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [enrollments, setEnrollments] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [programmeData, enrollmentsData] = await Promise.all([
        apiFetch(`/programmes/${programmeId}`),
        apiFetch(`/enrollments/programme/${programmeId}/team`),
      ]);
      setProgramme(programmeData);
      setEnrollments(enrollmentsData.enrollments || []);
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  }, [programmeId]);

  useEffect(() => {
    if (programmeId) {
      loadData();
    }
  }, [programmeId, loadData]);

  const filteredMembers = useMemo(() => {
    let members = enrollments;
    if (filter !== "all") {
      const roleMap: Record<FilterTab, string> = {
        all: "",
        students: "student",
        instructors: "instructor",
        tas: "ta",
      };
      const role = roleMap[filter];
      members = members.filter((m) => m.role === role);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      members = members.filter(
        (m) =>
          m.userId.name.toLowerCase().includes(q) ||
          m.userId.email.toLowerCase().includes(q)
      );
    }
    return members;
  }, [enrollments, search, filter]);

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
    { label: "Team" },
  ];

  const roleBadgeStyles: Record<string, string> = {
    student: "bg-emerald-100 text-emerald-700",
    instructor: "bg-purple-100 text-purple-700",
    ta: "bg-orange-100 text-orange-700",
  };

  const filterTabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "students", label: "Students" },
    { value: "instructors", label: "Instructors" },
    { value: "tas", label: "TAs" },
  ];

  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-6 md:px-6">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Team</h1>
        <p className="mt-1 text-slate-600">
          Connect with your programme peers and instructors
        </p>
      </div>

      <div className="flex flex-col gap-4 bg-slate-50 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="flex gap-1 rounded-lg bg-white p-1 shadow-sm">
            {filterTabs.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  filter === value
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((enrollment) => (
            <MemberCard key={enrollment._id} enrollment={enrollment} roleBadgeStyles={roleBadgeStyles} />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">
              {search ? 'No team members found matching your search.' : 'No team members enrolled yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({
  enrollment,
  roleBadgeStyles,
}: {
  enrollment: TeamMember;
  roleBadgeStyles: Record<string, string>;
}) {
  const user = enrollment.userId;
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const roleStyle = roleBadgeStyles[enrollment.role] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4 p-5">
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-sm font-semibold text-[var(--color-primary)]">
            {initials}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">
            {user.name}
          </h3>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${roleStyle}`}
          >
            {enrollment.role}
          </span>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}
