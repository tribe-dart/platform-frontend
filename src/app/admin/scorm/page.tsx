"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Package,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileArchive,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { apiFetch, apiUpload } from "@/lib/api";

interface ScormPackageInfo {
  _id: string;
  title: string;
  version: string;
  status: "processing" | "ready" | "error";
  fileSize: number;
  identifier: string;
  createdAt: string;
  uploadedBy?: { name: string; email: string };
  courseId?: { title: string };
  programmeId?: { title: string };
  errorMessage?: string;
}

export default function ScormAdminPage() {
  const [packages, setPackages] = useState<ScormPackageInfo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadPackages = useCallback(async () => {
    try {
      const data = await apiFetch("/scorm/packages");
      setPackages(data.packages || []);
      setLoaded(true);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // Load on first render
  if (!loaded) {
    loadPackages();
  }

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setError("Please upload a ZIP file");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress("Uploading and processing SCORM package...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await apiUpload("/scorm/upload", formData);

      setSuccess(
        `"${result.package.title}" uploaded successfully (${result.package.fileCount} files, SCORM ${result.package.version})`
      );
      setUploadProgress(null);
      loadPackages();
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will remove all files and tracking data.`)) return;

    try {
      await apiFetch(`/scorm/packages/${id}`, { method: "DELETE" });
      setSuccess(`"${title}" deleted`);
      loadPackages();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            SCORM Package Manager
          </h1>
          <p className="mt-1 text-slate-500">
            Upload, manage, and track SCORM learning content packages
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              &times;
            </button>
          </div>
        )}

        {/* Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`mb-8 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragOver
              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
              : "border-slate-300 bg-white hover:border-slate-400"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
              <p className="font-medium text-slate-700">{uploadProgress}</p>
              <p className="text-sm text-slate-500">
                This may take a moment for large packages...
              </p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="mb-1 text-lg font-medium text-slate-700">
                Drag & drop a SCORM ZIP file here
              </p>
              <p className="mb-4 text-sm text-slate-500">
                Supports SCORM 1.2 and SCORM 2004 packages (up to 500MB)
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]">
                <FileArchive className="h-4 w-4" />
                Browse Files
                <input
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </label>
            </>
          )}
        </div>

        {/* Package List */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Uploaded Packages ({packages.length})
          </h2>

          {packages.length === 0 && loaded && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-slate-500">
                No SCORM packages uploaded yet. Upload your first package above.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    pkg.status === "ready"
                      ? "bg-green-100 text-green-600"
                      : pkg.status === "error"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {pkg.status === "ready" ? (
                    <Package className="h-6 w-6" />
                  ) : pkg.status === "error" ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {pkg.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      SCORM {pkg.version}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        pkg.status === "ready"
                          ? "bg-green-100 text-green-700"
                          : pkg.status === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                    <span>{formatBytes(pkg.fileSize)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </span>
                    {pkg.uploadedBy && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {pkg.uploadedBy.name}
                      </span>
                    )}
                  </div>
                  {pkg.errorMessage && (
                    <p className="mt-1 text-xs text-red-600">
                      {pkg.errorMessage}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(pkg._id).then(() =>
                        setSuccess(`Package ID copied: ${pkg._id}`)
                      )
                    }
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    title="Copy Package ID"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id, pkg.title)}
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
