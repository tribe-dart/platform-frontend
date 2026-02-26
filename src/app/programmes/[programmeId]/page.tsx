"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { ScormPlayer } from "@/components/scorm/ScormPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Target,
  Loader2,
  Package,
  Eye,
  X,
  FileArchive,
  Clock,
} from "lucide-react";

type Tab = "overview" | "courses";

interface Programme {
  _id: string;
  title: string;
  institution: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  courses?: Course[];
}

interface Screen {
  _id: string;
  title: string;
  order?: number;
}

interface Course {
  _id: string;
  title: string;
  weeks?: Array<{ _id: string; weekNumber: number; screens: Screen[] }>;
}

interface ScormPackageInfo {
  _id: string;
  title: string;
  version: string;
  status: string;
  fileSize: number;
  description?: string;
  createdAt: string;
  uploadedBy?: { name: string };
}

export default function ProgrammePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const programmeId = params.programmeId as string;
  useAuthStore();
  const tab = (searchParams.get("tab") as Tab) || "courses";

  const [programme, setProgramme] = useState<Programme | null>(null);
  const [scormPackages, setScormPackages] = useState<ScormPackageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingScorm, setViewingScorm] = useState<ScormPackageInfo | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [progData, scormData] = await Promise.all([
        apiFetch(`/programmes/${programmeId}`),
        apiFetch(`/scorm/programme/${programmeId}`).catch(() => []),
      ]);
      setProgramme(progData);
      setScormPackages(scormData);
    } catch (err) {
      console.error("Failed to load programme:", err);
    } finally {
      setLoading(false);
    }
  }, [programmeId]);

  useEffect(() => {
    if (programmeId) loadData();
  }, [programmeId, loadData]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
      </div>
    );
  }

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-3 py-4 sm:px-4 sm:py-6 md:px-6">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
          {programme.title}
        </h1>
        {programme.institution && (
          <p className="mt-1 text-slate-600">{programme.institution}</p>
        )}
        {programme.description && (
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            {programme.description}
          </p>
        )}
        {programme.startDate && programme.endDate && (
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{formatDate(programme.startDate)}</span>
            <span>–</span>
            <span>{formatDate(programme.endDate)}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <nav
          className="scrollable-tabs flex gap-1 overflow-x-auto px-3 sm:px-4 md:px-6"
          aria-label="Tabs"
        >
          <Link
            href={`${basePath}?tab=overview`}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
              tab === "overview"
                ? "border-(--color-primary) text-(--color-primary)"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Overview
          </Link>
          <Link
            href={`${basePath}?tab=courses`}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
              tab === "courses"
                ? "border-(--color-primary) text-(--color-primary)"
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

      {/* Tab content */}
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
                  Programme Description
                </h2>
                <p className="mt-3 text-slate-600">
                  {programme.description || "No description available."}
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-4 rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                    <BookOpen className="h-6 w-6 text-(--color-primary)" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Key Info</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {scormPackages.length} learning module{scormPackages.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Status</h3>
                    <p className="mt-1 text-sm capitalize text-slate-600">
                      {programme.status?.replace("_", " ") || "Active"}
                    </p>
                  </div>
                </div>
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
              {/* SCORM Packages section */}
              {scormPackages.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {scormPackages.map((pkg) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                            <FileArchive className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 truncate">
                              {pkg.title}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                SCORM {pkg.version}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatFileSize(pkg.fileSize)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {pkg.description && (
                          <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                            {pkg.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          Added {new Date(pkg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingScorm(pkg)}
                          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--color-primary-hover)"
                        >
                          <Eye className="h-4 w-4" />
                          Launch Module
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    No learning modules yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Learning modules will appear here once they are assigned to this programme.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SCORM Viewer Modal */}
      {viewingScorm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {viewingScorm.title}
                </h2>
                <p className="text-sm text-slate-600">
                  SCORM {viewingScorm.version}
                </p>
              </div>
              <button
                onClick={() => setViewingScorm(null)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
              <ScormPlayer
                packageId={viewingScorm._id}
                version={viewingScorm.version as "1.2" | "2004"}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
