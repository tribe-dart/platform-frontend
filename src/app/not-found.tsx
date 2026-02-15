import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <p className="text-8xl font-bold text-slate-200 md:text-9xl">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-800 md:text-2xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-center text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
