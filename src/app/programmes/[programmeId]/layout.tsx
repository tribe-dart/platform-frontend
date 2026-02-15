"use client";

import { useParams } from "next/navigation";
import { getProgramme } from "@/lib/mock-data";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import Link from "next/link";

export default function ProgrammeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const programme = getProgramme(programmeId);

  if (!programme) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Programme not found
        </h1>
        <p className="text-slate-600">
          The programme you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/dashboard"
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const courses = programme.courses.map((c) => ({
    id: c.id,
    title: c.title,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-bg)]">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar
          programmeId={programmeId}
          programmeName={programme.title}
          courses={courses}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto mobile-nav-offset">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
