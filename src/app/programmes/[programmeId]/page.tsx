"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProgramme } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Target,
} from "lucide-react";

type Tab = "overview" | "courses";

export default function ProgrammePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const programmeId = params.programmeId as string;
  const programme = getProgramme(programmeId);
  const tab = (searchParams.get("tab") as Tab) || "courses";

  if (!programme) return null;

  const basePath = `/programmes/${programmeId}`;
  const breadcrumbItems = [
    { label: "Programmes", href: "/dashboard" },
    { label: programme.title },
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusStyles = {
    not_started: "bg-slate-100 text-slate-600",
    in_progress: "bg-emerald-100 text-emerald-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-200 bg-white px-3 py-4 sm:px-4 sm:py-6 md:px-6">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
          {programme.title}
        </h1>
        <p className="mt-1 text-slate-600">{programme.institution}</p>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          {programme.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>{formatDate(programme.startDate)}</span>
          <span>–</span>
          <span>{formatDate(programme.endDate)}</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Overall progress</span>
            <span className="text-slate-600">{programme.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${programme.progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <nav className="scrollable-tabs flex gap-1 overflow-x-auto px-3 sm:px-4 md:px-6" aria-label="Tabs">
          <Link
            href={`${basePath}?tab=overview`}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
              tab === "overview"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Overview
          </Link>
          <Link
            href={`${basePath}?tab=courses`}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
              tab === "courses"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Courses
          </Link>
          <Link
            href={`${basePath}/team`}
            className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 sm:px-4"
          >
            Team
          </Link>
          <Link
            href={`${basePath}/newsfeed`}
            className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 sm:px-4"
          >
            Newsfeed
          </Link>
          <Link
            href={`${basePath}/calendar`}
            className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 sm:px-4"
          >
            Calendar
          </Link>
          <Link
            href={`${basePath}/grades`}
            className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 sm:px-4"
          >
            Grades
          </Link>
        </nav>
      </div>

      <div className="flex-1 bg-slate-50 p-4 md:p-6">
        <AnimatePresence mode="wait">
          {tab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-4xl"
            >
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Programme description
                </h2>
                <p className="mt-3 text-slate-600">{programme.description}</p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-4 rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <BookOpen className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Key info</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {programme.courseCount} courses •{" "}
                      {programme.courses.reduce(
                        (acc, c) => acc + c.weekCount,
                        0
                      )}{" "}
                      weeks total
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      Learning objectives
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Lead digital transformation, master financial analysis,
                      develop adaptive leadership skills
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-medium text-slate-900">
                  What you&apos;ll achieve
                </h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                    <span>
                      Develop and execute digital transformation strategies
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                    <span>
                      Apply financial management and analysis frameworks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                    <span>
                      Lead high-performing teams in the digital age
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-6xl"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {programme.courses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-semibold text-slate-900">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {course.instructors
                          .map((i) => `${i.firstName} ${i.lastName}`)
                          .join(", ")}
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-medium text-slate-700">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-[var(--color-primary)]"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[course.status]}`}
                        >
                          {course.status.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-500">
                          {course.weekCount} weeks
                        </span>
                      </div>
                      <Link
                        href={`${basePath}/courses/${course.id}`}
                        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                      >
                        Enter Course
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
