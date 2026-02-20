"use client";

import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-[var(--surface-bg)]">
        <Header />
        <main className="pt-[var(--header-height)]">{children}</main>
      </div>
    </AuthGuard>
  );
}
