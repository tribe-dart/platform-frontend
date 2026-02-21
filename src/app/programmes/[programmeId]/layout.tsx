"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Programme {
  _id: string;
  title: string;
  institution: string;
  description: string;
  courses?: Array<{ _id: string; title: string }>;
}

export default function ProgrammeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgramme = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/programmes/${programmeId}`);
        setProgramme(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load programme');
      } finally {
        setLoading(false);
      }
    };

    if (programmeId) {
      loadProgramme();
    }
  }, [programmeId]);

  if (loading) {
    return (
      <AuthGuard requireAuth>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      </AuthGuard>
    );
  }

  if (error || !programme) {
    return (
      <AuthGuard requireAuth>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Programme not found
          </h1>
          <p className="text-slate-600">
            {error || "The programme you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Back to Dashboard
          </Link>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth>
      <div className="flex min-h-screen flex-col bg-[var(--surface-bg)]">
        <Header />
        <div className="flex flex-1 pt-16">
          <Sidebar
            programmeId={programmeId}
            programmeName={programme.title}
            courses={[]}
          />
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto mobile-nav-offset">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
