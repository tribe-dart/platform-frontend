"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";

const notificationCount = 3;

export function Header() {
  const pathname = usePathname();
  const { setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User"
    : "User";
  const displayEmail = user?.email ?? "user@example.com";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link
          href="/dashboard"
          className="text-xl font-semibold text-[var(--color-primary)]"
        >
          LearnPlatform
        </Link>
      </div>

      <nav className="hidden items-center gap-1 md:flex">
        <Link
          href="/dashboard"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            pathname === "/dashboard"
              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/programmes/p1/calendar"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            pathname.includes("/calendar")
              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          Calendar
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100"
            aria-expanded={avatarOpen}
            aria-haspopup="true"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-medium text-white">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                displayName[0]?.toUpperCase() ?? "U"
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${
                avatarOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-medium text-slate-900">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-500">{displayEmail}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setAvatarOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setAvatarOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setAvatarOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
