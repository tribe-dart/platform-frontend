"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pin, Loader2, Calendar, User, Paperclip } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

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

interface Programme {
  _id: string;
  title: string;
}

export default function NewsfeedPage() {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const { user } = useAuthStore();
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [programmeData, newsData] = await Promise.all([
        apiFetch(`/programmes/${programmeId}`),
        apiFetch(`/news?programmeId=${programmeId}`),
      ]);
      setProgramme(programmeData);
      setPosts(newsData);
    } catch (err) {
      console.error('Failed to load newsfeed:', err);
    } finally {
      setLoading(false);
    }
  }, [programmeId]);

  useEffect(() => {
    if (programmeId) {
      loadData();
    }
  }, [programmeId, loadData]);

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
    { label: "Newsfeed" },
  ];

  const pinnedPosts = posts.filter((p) => p.isPinned);
  const regularPosts = posts.filter((p) => !p.isPinned);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1">
        <div className="border-b border-slate-200 bg-white px-4 py-6 md:px-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Newsfeed</h1>
              <p className="mt-1 text-slate-600">
                Latest updates and announcements from your programme
              </p>
            </div>
            {user?.role === 'admin' && (
              <Link
                href={`/admin/news?programme=${programmeId}`}
                className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Manage News
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 md:p-6">
          {posts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">No news posts yet. Check back later for updates!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <NewsCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="w-full shrink-0 lg:w-80">
        <div className="border-t border-slate-200 bg-white p-4 lg:border-t-0 lg:border-l lg:p-6">
          {pinnedPosts.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <Pin className="h-4 w-4" />
                Pinned Announcements
              </h3>
              <div className="mt-3 space-y-3">
                {pinnedPosts.map((post) => (
                  <div
                    key={post._id}
                    className="rounded-lg bg-white p-3 shadow-sm"
                  >
                    <h4 className="font-medium text-slate-900 text-sm">{post.title}</h4>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">{post.content}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {post.authorId.name} · {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function NewsCard({ post }: { post: NewsPost }) {
  const timeAgo = formatTimeAgo(post.createdAt);
  const authorInitials = post.authorId.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {post.isPinned && (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-5 py-2">
          <Pin className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Pinned Announcement</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-sm font-semibold text-[var(--color-primary)]">
            {authorInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">
                {post.authorId.name}
              </span>
              <span className="text-sm text-slate-400">•</span>
              <span className="text-sm text-slate-500">{timeAgo}</span>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-700">{post.content}</p>

            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {post.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <Paperclip className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{attachment.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
