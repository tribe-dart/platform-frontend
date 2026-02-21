'use client';

import { useState, useCallback, useEffect } from 'react';
import { Newspaper, Plus, Edit2, Trash2, Pin, ArrowLeft, Loader2, X, Calendar, User, Search } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface Programme {
  _id: string;
  title: string;
  institution: string;
}

interface NewsPost {
  _id: string;
  title: string;
  content: string;
  programmeId: string;
  authorId: {
    _id: string;
    name: string;
    email: string;
  };
  isPinned: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function NewsAdminPage() {
  const searchParams = useSearchParams();
  const preselectedProgrammeId = searchParams.get('programme');

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>(preselectedProgrammeId || '');
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNews, setLoadingNews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProgrammes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/programmes');
      setProgrammes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load programmes');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNews = useCallback(async (programmeId: string) => {
    if (!programmeId) return;
    try {
      setLoadingNews(true);
      const data = await apiFetch(`/news?programmeId=${programmeId}`);
      setNews(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load news');
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    loadProgrammes();
  }, [loadProgrammes]);

  useEffect(() => {
    if (selectedProgrammeId) {
      loadNews(selectedProgrammeId);
    } else {
      setNews([]);
    }
  }, [selectedProgrammeId, loadNews]);

  const handleDelete = async (newsId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await apiFetch(`/news/${newsId}`, { method: 'DELETE' });
      setSuccess('News post deleted successfully');
      loadNews(selectedProgrammeId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete news post');
    }
  };

  const handleTogglePin = async (newsId: string) => {
    try {
      await apiFetch(`/news/${newsId}/pin`, { method: 'PATCH' });
      setSuccess('Pin status updated');
      loadNews(selectedProgrammeId);
    } catch (err: any) {
      setError(err.message || 'Failed to update pin status');
    }
  };

  const filteredNews = news.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProgramme = programmes.find((p) => p._id === selectedProgrammeId);

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <Newspaper className="h-7 w-7 text-[var(--color-primary)]" />
                News Management
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Create and manage programme news and announcements
              </p>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4"
          >
            <p className="text-sm text-green-800">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="mt-2 text-sm font-medium text-green-600 hover:text-green-700"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Programme
          </label>
          <select
            value={selectedProgrammeId}
            onChange={(e) => setSelectedProgrammeId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            <option value="">Choose a programme...</option>
            {programmes.map((prog) => (
              <option key={prog._id} value={prog._id}>
                {prog.title} - {prog.institution}
              </option>
            ))}
          </select>
        </div>

        {selectedProgrammeId && (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
              <button
                onClick={() => {
                  setEditingNews(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                <Plus className="h-4 w-4" />
                Create News Post
              </button>
            </div>

            {loadingNews ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                <Newspaper className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {searchTerm ? 'No matching news posts' : 'No news posts yet'}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {searchTerm
                    ? 'Try adjusting your search'
                    : 'Create your first news post to share updates with enrolled users'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNews.map((post) => (
                  <div
                    key={post._id}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    {post.isPinned && (
                      <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-5 py-2">
                        <Pin className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">Pinned</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                          <p className="mt-2 text-slate-600 line-clamp-3">{post.content}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <User className="h-4 w-4" />
                              {post.authorId.name}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePin(post._id)}
                            className={`rounded-lg p-2 transition-colors ${
                              post.isPinned
                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                            title={post.isPinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingNews(post);
                              setShowModal(true);
                            }}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post._id, post.title)}
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
          </>
        )}
      </div>

      {showModal && (
        <NewsModal
          news={editingNews}
          programmeId={selectedProgrammeId}
          programmeName={selectedProgramme?.title || ''}
          onClose={() => {
            setShowModal(false);
            setEditingNews(null);
          }}
          onSuccess={(message) => {
            setSuccess(message);
            setShowModal(false);
            setEditingNews(null);
            loadNews(selectedProgrammeId);
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

function NewsModal({
  news,
  programmeId,
  programmeName,
  onClose,
  onSuccess,
  onError,
}: {
  news: NewsPost | null;
  programmeId: string;
  programmeName: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}) {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    isPinned: news?.isPinned || false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      onError('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);

      if (news) {
        await apiFetch(`/news/${news._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        onSuccess('News post updated successfully');
      } else {
        await apiFetch('/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            programmeId,
          }),
        });
        onSuccess('News post created successfully');
      }
    } catch (err: any) {
      onError(err.message || 'Failed to save news post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {news ? 'Edit News Post' : 'Create News Post'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
            Programme: <span className="font-medium">{programmeName}</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter news title"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your news content here..."
                rows={8}
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="isPinned" className="text-sm font-medium text-slate-700">
                Pin this announcement
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{news ? 'Update' : 'Create'} Post</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
