"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  CalendarDays,
  BarChart3,
  HelpCircle,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { motion, AnimatePresence } from "framer-motion";

export interface CourseItem {
  id: string;
  title: string;
}

interface SidebarProps {
  programmeId: string;
  programmeName: string;
  courses: CourseItem[];
}

const navItems = [
  { section: "overview", label: "Overview", icon: LayoutDashboard },
  { section: "courses", label: "Courses", icon: BookOpen, hasNested: true },
  { section: "team", label: "Team", icon: Users },
  { section: "newsfeed", label: "Newsfeed", icon: MessageSquare },
  { section: "calendar", label: "Calendar", icon: CalendarDays },
  { section: "grades", label: "Grades", icon: BarChart3 },
  { section: "help", label: "Help", icon: HelpCircle },
];

export function Sidebar({
  programmeId,
  programmeName,
  courses,
}: SidebarProps) {
  const pathname = usePathname();
  const {
    sidebarOpen,
    sidebarCollapsed,
    setSidebarOpen,
    toggleSidebar,
  } = useUIStore();

  const basePath = `/programmes/${programmeId}`;

  const isActive = (section: string) => {
    if (section === "courses") {
      return pathname.includes(`${basePath}/courses`);
    }
    return pathname === `${basePath}/${section}`;
  };

  const isCourseActive = (courseId: string) =>
    pathname.includes(`${basePath}/courses/${courseId}`);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[var(--surface-sidebar)] text-white">
      <div className="flex items-center justify-between border-b border-slate-600/50 px-4 py-4">
        <h2
          className={`truncate text-lg font-semibold ${
            sidebarCollapsed ? "hidden" : ""
          }`}
        >
          {programmeName}
        </h2>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-600/50 hover:text-white md:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ section, label, icon: Icon, hasNested }) => (
          <div key={section}>
            {hasNested ? (
              <div className="px-2">
                <Link
                  href={`${basePath}/courses`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  } ${
                    isActive(section)
                      ? "border-l-4 border-emerald-500 bg-slate-600/50 pl-[calc(0.75rem-4px)]"
                      : "text-slate-300 hover:bg-slate-600/30 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </Link>
                {!sidebarCollapsed && courses.length > 0 && (
                  <div className="ml-6 mt-1 space-y-0.5 border-l border-slate-600 pl-3">
                    {courses.map((course) => (
                      <Link
                        key={course.id}
                        href={`${basePath}/courses/${course.id}`}
                        className={`block truncate rounded py-1.5 pl-2 text-sm transition-colors ${
                          isCourseActive(course.id)
                            ? "text-emerald-300"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {course.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`${basePath}/${section}`}
                className={`mx-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  sidebarCollapsed ? "justify-center px-2" : ""
                } ${
                  isActive(section)
                    ? "border-l-4 border-emerald-500 bg-slate-600/50 pl-[calc(0.75rem-4px)]"
                    : "text-slate-300 hover:bg-slate-600/30 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="hidden border-t border-slate-600/50 p-2 md:block">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-slate-400 transition-colors hover:bg-slate-600/50 hover:text-white"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - desktop: always visible, collapsible; mobile: overlay drawer */}
      <aside
        className={`
          fixed left-0 top-16 z-40 h-[calc(100vh-4rem)]
          md:static md:top-0 md:h-screen
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${sidebarCollapsed ? "md:w-16" : "md:w-[260px]"}
          w-[260px] shrink-0 transition-transform duration-200 md:transition-[width]
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
