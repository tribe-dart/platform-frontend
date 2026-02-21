'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
  Calendar,
  Users,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

interface Programme {
  _id: string;
  title: string;
  institution: string;
  description?: string;
  thumbnail?: string;
  startDate?: string;
  endDate?: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
}

export default function ProgrammesAdminPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<Programme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProgrammes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/programmes');
      setProgrammes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgrammes();
  }, [loadProgrammes]);

  const handleDelete = async (programme: Programme) => {
    if (!confirm(`Delete programme "${programme.title}"? This action cannot be undone.`)) return;

    try {
      await apiFetch(`/programmes/${programme._id}`, { method: 'DELETE' });
      setSuccess(`Programme "${programme.title}" deleted successfully`);
      loadProgrammes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredProgrammes = programmes.filter((prog) => {
    const matchesSearch =
      !searchQuery ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || prog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    active: 'bg-green-100 text-green-700',
    archived: 'bg-amber-100 text-amber-700',
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
              <h1 className="text-2xl font-bold text-slate-900">Programme Management</h1>
              <p className="mt-1 text-slate-500">
                Create and manage learning programmes
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProgramme(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <Plus className="h-4 w-4" />
              Create Programme
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

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search programmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : filteredProgrammes.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No programmes found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProgrammes.map((programme) => (
              <div
                key={programme._id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="h-2 bg-gradient-to-r from-[#f46711] to-[#d4550d]" />
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[programme.status]
                      }`}
                    >
                      {programme.status}
                    </span>
                  </div>

                  <h3 className="mb-1 text-lg font-semibold text-slate-900 line-clamp-2">
                    {programme.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate-600">{programme.institution}</p>

                  {programme.description && (
                    <p className="mb-4 text-sm text-slate-500 line-clamp-2">
                      {programme.description}
                    </p>
                  )}

                  {(programme.startDate || programme.endDate) && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {programme.startDate && (
                        <span>{new Date(programme.startDate).toLocaleDateString()}</span>
                      )}
                      {programme.startDate && programme.endDate && <span>-</span>}
                      {programme.endDate && (
                        <span>{new Date(programme.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/programmes/${programme._id}/overview`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                        title="View as Student"
                      >
                        <Eye className="h-4 w-4" />
                        View Programme
                      </Link>
                      <Link
                        href={`/admin/enrollments?programme=${programme._id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <Users className="h-4 w-4" />
                        Enrollments
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProgramme(programme);
                          setShowModal(true);
                        }}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        title="Edit"
                      >
                        <Edit2 className="inline h-4 w-4 mr-1.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(programme)}
                        className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="inline h-4 w-4 mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ProgrammeModal
          programme={editingProgramme}
          onClose={() => {
            setShowModal(false);
            setEditingProgramme(null);
          }}
          onSuccess={(message) => {
            setSuccess(message);
            setShowModal(false);
            setEditingProgramme(null);
            loadProgrammes();
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

function ProgrammeModal({
  programme,
  onClose,
  onSuccess,
  onError,
}: {
  programme: Programme | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}) {
  const [title, setTitle] = useState(programme?.title || '');
  const [institution, setInstitution] = useState(programme?.institution || '');
  const [description, setDescription] = useState(programme?.description || '');
  const [thumbnail, setThumbnail] = useState(programme?.thumbnail || '');
  const [startDate, setStartDate] = useState(
    programme?.startDate ? new Date(programme.startDate).toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState(
    programme?.endDate ? new Date(programme.endDate).toISOString().split('T')[0] : ''
  );
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>(
    programme?.status || 'draft'
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = {
        title,
        institution,
        description,
        thumbnail: thumbnail || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status,
      };

      if (programme) {
        await apiFetch(`/programmes/${programme._id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        onSuccess(`Programme "${title}" updated successfully`);
      } else {
        await apiFetch('/programmes', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        onSuccess(`Programme "${title}" created successfully`);
      }
    } catch (err: any) {
      onError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl my-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {programme ? 'Edit Programme' : 'Create New Programme'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Programme Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="Digital Transformation Strategy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Institution *
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                placeholder="MIT Sloan"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="Brief description of the programme..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Thumbnail URL (optional)
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Start Date (optional)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                End Date (optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {programme ? 'Updating...' : 'Creating...'}
                </span>
              ) : programme ? (
                'Update Programme'
              ) : (
                'Create Programme'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
