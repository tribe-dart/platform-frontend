'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Upload,
  Package,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileArchive,
  Clock,
  Edit2,
  ArrowLeft,
  X,
  BookOpen,
  Share2,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch, apiUpload } from '@/lib/api';
import { motion } from 'framer-motion';
import { ScormPlayer } from '@/components/scorm/ScormPlayer';

interface Programme {
  _id: string;
  title: string;
  institution: string;
}

interface ScormPackageInfo {
  _id: string;
  title: string;
  version: string;
  status: 'processing' | 'ready' | 'error';
  fileSize: number;
  identifier: string;
  description?: string;
  createdAt: string;
  uploadedBy?: { name: string; email: string };
  programmeIds?: Programme[];
  errorMessage?: string;
}

export default function ScormAdminPage() {
  const [packages, setPackages] = useState<ScormPackageInfo[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<ScormPackageInfo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingPackage, setViewingPackage] = useState<ScormPackageInfo | null>(null);

  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/scorm/packages');
      setPackages(data.packages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProgrammes = useCallback(async () => {
    try {
      const data = await apiFetch('/programmes');
      setProgrammes(data || []);
    } catch (err: any) {
      console.error('Failed to load programmes:', err);
    }
  }, []);

  useEffect(() => {
    loadPackages();
    loadProgrammes();
  }, [loadPackages, loadProgrammes]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will remove all files and tracking data.`)) return;

    try {
      await apiFetch(`/scorm/packages/${id}`, { method: 'DELETE' });
      setSuccess(`"${title}" deleted successfully`);
      loadPackages();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const statusIcons = {
    processing: <Clock className="h-4 w-4 text-amber-600 animate-spin" />,
    ready: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    error: <AlertTriangle className="h-4 w-4 text-red-600" />,
  };

  const statusColors = {
    processing: 'bg-amber-100 text-amber-700',
    ready: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">SCORM Package Management</h1>
              <p className="mt-1 text-slate-500">
                Upload and manage SCORM learning content
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <Upload className="h-4 w-4" />
              Upload SCORM Package
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <p className="text-sm">{error}</p>
            <button onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <p className="text-sm">{success}</p>
            <button onClick={() => setSuccess(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <FileArchive className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500 mb-4">No SCORM packages uploaded yet</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <Upload className="h-4 w-4" />
              Upload Your First Package
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${
                    pkg.status === 'ready'
                      ? 'bg-green-100 text-green-600'
                      : pkg.status === 'error'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <Package className="h-6 w-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{pkg.title}</h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            statusColors[pkg.status]
                          }`}
                        >
                          {statusIcons[pkg.status]}
                          {pkg.status}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          SCORM {pkg.version}
                        </span>
                      </div>

                      {pkg.description && (
                        <p className="text-sm text-slate-600 mb-2">{pkg.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>{formatFileSize(pkg.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(pkg.createdAt).toLocaleDateString()}</span>
                        {pkg.uploadedBy && (
                          <>
                            <span>•</span>
                            <span>by {pkg.uploadedBy.name}</span>
                          </>
                        )}
                      </div>

                      {pkg.programmeIds && pkg.programmeIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                          {pkg.programmeIds.map((prog) => (
                            <Link
                              key={prog._id}
                              href={`/programmes/${prog._id}/overview`}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                              title={`View ${prog.title}`}
                            >
                              {prog.title}
                            </Link>
                          ))}
                        </div>
                      )}

                      {pkg.status === 'error' && pkg.errorMessage && (
                        <div className="mt-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
                          {pkg.errorMessage}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {pkg.status === 'ready' && (
                        <button
                          onClick={() => setViewingPackage(pkg)}
                          className="rounded-lg p-2 text-blue-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="View Content"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingPackage(pkg)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        title="Manage Programmes"
                      >
                        <Share2 className="h-4 w-4" />
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={(message) => {
            setSuccess(message);
            setShowUploadModal(false);
            loadPackages();
          }}
          onError={setError}
          programmes={programmes}
        />
      )}

      {editingPackage && (
        <ManageProgrammesModal
          package={editingPackage}
          programmes={programmes}
          onClose={() => setEditingPackage(null)}
          onSuccess={(message) => {
            setSuccess(message);
            setEditingPackage(null);
            loadPackages();
          }}
          onError={setError}
        />
      )}

      {viewingPackage && (
        <ViewScormModal
          package={viewingPackage}
          onClose={() => setViewingPackage(null)}
        />
      )}
    </div>
  );
}

function UploadModal({
  onClose,
  onSuccess,
  onError,
  programmes,
}: {
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
  programmes: Programme[];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedProgrammes, setSelectedProgrammes] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.zip')) {
      setFile(droppedFile);
    } else {
      onError('Please upload a ZIP file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
      } else {
        onError('Please upload a ZIP file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedProgrammes.length > 0) {
        formData.append('programmeIds', JSON.stringify(selectedProgrammes));
      }

      const result = await apiUpload('/scorm/upload', formData);
      onSuccess(
        `"${result.package.title}" uploaded successfully (${result.package.fileCount} files, SCORM ${result.package.version})`
      );
    } catch (err: any) {
      onError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleProgramme = (progId: string) => {
    setSelectedProgrammes((prev) =>
      prev.includes(progId) ? prev.filter((id) => id !== progId) : [...prev, progId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl my-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Upload SCORM Package</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              dragOver
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                : 'border-slate-300 bg-slate-50'
            }`}
          >
            <input
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={uploading}
            />
            <FileArchive className="mx-auto mb-3 h-12 w-12 text-slate-400" />
            {file ? (
              <div>
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-slate-700">
                  Drop your SCORM ZIP file here or click to browse
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Supports SCORM 1.2 and SCORM 2004
                </p>
              </div>
            )}
          </div>

          {file && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Assign to Programmes (optional)
              </label>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 p-3 space-y-2">
                {programmes.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No programmes available
                  </p>
                ) : (
                  programmes.map((prog) => (
                    <label
                      key={prog._id}
                      className="flex items-center gap-3 rounded-lg p-2 cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProgrammes.includes(prog._id)}
                        onChange={() => toggleProgramme(prog._id)}
                        className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{prog.title}</p>
                        <p className="text-xs text-slate-500">{prog.institution}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
              {selectedProgrammes.length > 0 && (
                <p className="mt-2 text-xs text-slate-600">
                  {selectedProgrammes.length} programme(s) selected
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                'Upload Package'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ManageProgrammesModal({
  package: pkg,
  programmes,
  onClose,
  onSuccess,
  onError,
}: {
  package: ScormPackageInfo;
  programmes: Programme[];
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}) {
  const [selectedProgrammes, setSelectedProgrammes] = useState<string[]>(
    pkg.programmeIds?.map((p) => p._id) || []
  );
  const [saving, setSaving] = useState(false);

  const toggleProgramme = (progId: string) => {
    setSelectedProgrammes((prev) =>
      prev.includes(progId) ? prev.filter((id) => id !== progId) : [...prev, progId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/scorm/packages/${pkg._id}`, {
        method: 'PUT',
        body: JSON.stringify({ programmeIds: selectedProgrammes }),
      });
      onSuccess(`Programme assignments updated for "${pkg.title}"`);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Manage Programme Access</h2>
            <p className="mt-1 text-sm text-slate-600">{pkg.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-3">
            Select which programmes can access this SCORM package:
          </p>
          <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200 p-3 space-y-2">
            {programmes.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No programmes available</p>
            ) : (
              programmes.map((prog) => (
                <label
                  key={prog._id}
                  className="flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProgrammes.includes(prog._id)}
                    onChange={() => toggleProgramme(prog._id)}
                    className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{prog.title}</p>
                    <p className="text-sm text-slate-500">{prog.institution}</p>
                  </div>
                </label>
              ))
            )}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            {selectedProgrammes.length} programme(s) selected
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ViewScormModal({
  package: pkg,
  onClose,
}: {
  package: ScormPackageInfo;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{pkg.title}</h2>
            <p className="text-sm text-slate-600">SCORM {pkg.version} Preview</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <ScormPlayer packageId={pkg._id} version={pkg.version as "1.2" | "2004"} />
        </div>
      </motion.div>
    </div>
  );
}
