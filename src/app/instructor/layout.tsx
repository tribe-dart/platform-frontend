'use client';

import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-[var(--surface-bg)]">
        <Header />
        <main className="pt-[var(--header-height)]">{children}</main>
      </div>
    </AuthGuard>
  );
}
