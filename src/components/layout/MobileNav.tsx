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
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-sm px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] md:hidden">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive =
          pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors sm:px-3 sm:py-2 ${
              isActive
                ? "text-(--color-primary)"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`}
            />
            <span className="text-[10px] font-medium sm:text-xs">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
