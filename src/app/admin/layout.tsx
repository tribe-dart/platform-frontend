"use client";

import { Header } from "@/components/layout/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <Header />
      <main className="pt-[var(--header-height)]">{children}</main>
    </div>
  );
}
