"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, CalendarDays, BarChart3, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/programmes", icon: BookOpen, label: "Courses" },
  { href: "/dashboard/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/dashboard/grades", icon: BarChart3, label: "Grades" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2 md:hidden">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive =
          pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? "text-[var(--color-primary)]"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`}
            />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
