"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { getProgramme } from "@/lib/mock-data";
import {
  newsfeedPosts as initialPosts,
  teamMembers,
  currentUser,
} from "@/lib/mock-data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Heart, MessageCircle, Send, Pin } from "lucide-react";
import type { NewsfeedPost } from "@/types";

export default function NewsfeedPage() {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const programme = getProgramme(programmeId);
  const [posts, setPosts] = useState<NewsfeedPost[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");

  const onlineMembers = teamMembers.filter((m) => m.isOnline);
  const pinnedPosts = posts.slice(0, 1);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: NewsfeedPost = {
      id: `nf-${Date.now()}`,
      author: currentUser,
      content: newPostContent.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
  };

  if (!programme) return null;

  const breadcrumbItems = [
    { label: "Programmes", href: "/dashboard" },
    { label: programme.title, href: `/programmes/${programmeId}` },
    { label: "Newsfeed" },
  ];

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1">
        <div className="border-b border-slate-200 bg-white px-4 py-6 md:px-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Newsfeed</h1>
          <p className="mt-1 text-slate-600">
            Share updates and connect with your programme community
          </p>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 md:p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Post
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        </div>
      </div>

      <aside className="w-full shrink-0 lg:w-80">
        <div className="border-t border-slate-200 bg-white p-4 lg:border-t-0 lg:border-l lg:p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Online Now</h3>
            <div className="mt-3 space-y-2">
              {onlineMembers.map((member) => {
                const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700">
                        {initials}
                      </div>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-green-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Pin className="h-4 w-4" />
              Pinned
            </h3>
            <div className="mt-3 space-y-2">
              {pinnedPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg bg-white p-3 text-sm text-slate-600"
                >
                  <p className="line-clamp-2">{post.content}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {post.author.firstName} {post.author.lastName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PostCard({
  post,
  onLike,
}: {
  post: NewsfeedPost;
  onLike: (id: string) => void;
}) {
  const initials = `${post.author.firstName[0]}${post.author.lastName[0]}`.toUpperCase();
  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {post.author.firstName} {post.author.lastName}
            </span>
            <span className="text-sm text-slate-400">•</span>
            <span className="text-sm text-slate-500">{timeAgo}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{post.content}</p>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                post.isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
              />
              <span>{post.likes}</span>
            </button>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <MessageCircle className="h-4 w-4" />
              {post.comments.length}
            </span>
          </div>

          {post.comments.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              {post.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
}: {
  comment: { id: string; author: { firstName: string; lastName: string }; content: string; createdAt: string };
}) {
  const initials = `${comment.author.firstName[0]}${comment.author.lastName[0]}`.toUpperCase();
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
        {initials}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-900">
            {comment.author.firstName} {comment.author.lastName}
          </span>
          <span className="text-xs text-slate-400">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-slate-600">{comment.content}</p>
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
