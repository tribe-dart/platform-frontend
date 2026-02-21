"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  X,
  Home,
  Shield,
  GraduationCap,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { AnimatePresence, motion } from "framer-motion";

const notificationCount = 3;

export function Header() {
  const pathname = usePathname();
  const { setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User"
    : "User";
  const displayEmail = user?.email ?? "user@example.com";

  const mobileNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    ...(user?.role === "admin"
      ? [{ href: "/admin", label: "Admin", icon: Shield }]
      : []),
    ...(user?.role === "instructor"
      ? [{ href: "/instructor", label: "Instructor", icon: GraduationCap }]
      : []),
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-3 shadow-sm sm:h-16 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              // On programme pages (where Sidebar exists), open the sidebar
              // On other pages, open mobile menu
              if (pathname.startsWith("/programmes/")) {
                setSidebarOpen(true);
              } else {
                setMobileMenuOpen(true);
              }
            }}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/cropped-LOGO-300x93.png"
              alt="Innov8ive Academy"
              width={150}
              height={46}
              priority
              className="h-6 w-auto sm:h-8"
            />
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
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Admin
            </Link>
          )}
          {user?.role === "instructor" && (
            <Link
              href="/instructor"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/instructor")
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Instructor
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {notificationCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white sm:right-1 sm:top-1">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="flex items-center gap-1 rounded-full p-1 pr-1.5 transition-colors hover:bg-slate-100 sm:gap-2 sm:pr-2"
              aria-expanded={avatarOpen}
              aria-haspopup="true"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-(--color-primary) text-xs font-medium text-white sm:h-9 sm:w-9 sm:text-sm">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt=""
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  displayName[0]?.toUpperCase() ?? "U"
                )}
              </div>
              <ChevronDown
                className={`hidden h-4 w-4 text-slate-500 transition-transform sm:block ${
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

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-60 bg-black/50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-70 flex h-full w-72 flex-col bg-white shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <Image
                  src="/cropped-LOGO-300x93.png"
                  alt="Innov8ive Academy"
                  width={150}
                  height={46}
                  className="h-7 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User info */}
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-primary) text-sm font-medium text-white">
                    {displayName[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {displayEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {mobileNavItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        pathname === href || pathname.startsWith(href + "/")
                          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="my-4 border-t border-slate-100" />

                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </div>
              </nav>

              <div className="border-t border-slate-200 px-3 py-3">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
