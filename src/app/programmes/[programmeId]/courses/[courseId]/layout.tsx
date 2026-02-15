"use client";

import { use } from "react";
import { useProgressStore } from "@/stores/progressStore";
import { getCourse } from "@/lib/mock-data";
import { Header } from "@/components/layout/Header";
import { CourseSidebar, type WeekItem } from "@/components/layout/CourseSidebar";
import { MobileNav } from "@/components/layout/MobileNav";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ programmeId: string; courseId: string }>;
}

export default function CourseLayout({ children, params }: CourseLayoutProps) {
  const { programmeId, courseId } = use(params);
  const course = getCourse(courseId);
  const screenStatuses = useProgressStore((s) => s.screenStatuses);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Course not found</p>
      </div>
    );
  }

  const weeks: WeekItem[] = course.weeks.map((week) => ({
    id: week.id,
    number: week.number,
    title: week.title,
    screens: week.screens.map((screen) => ({
      id: screen.id,
      number: screen.number,
      title: screen.title,
      status: (screenStatuses[screen.id] ?? screen.status) as
        | "unread"
        | "review"
        | "done",
    })),
    isCompleted: week.isCompleted,
    progress: week.progress,
  }));

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <Header />
      <div className="flex pt-16">
        <div className="hidden md:block">
          <CourseSidebar
          programmeId={programmeId}
          courseId={courseId}
          courseName={course.title}
          weeks={weeks}
        />
        </div>
        <main className="flex-1 mobile-nav-offset min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
