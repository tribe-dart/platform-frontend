'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuthStore } from '@/stores/authStore';
import { currentUser } from '@/lib/mock-data';
import { Camera } from 'lucide-react';

const TIMEZONES = [
  'Africa/Accra',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'UTC',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [instantNotifications, setInstantNotifications] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setBio(user.bio ?? '');
      setLocation(user.location ?? '');
      setTimezone(user.timezone ?? 'UTC');
    } else if (isAuthenticated) {
      setFirstName(currentUser.firstName ?? '');
      setLastName(currentUser.lastName ?? '');
      setBio(currentUser.bio ?? '');
      setLocation(currentUser.location ?? '');
      setTimezone(currentUser.timezone ?? 'UTC');
    }
  }, [user, isAuthenticated]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would persist to the backend
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    // In a real app, this would call the API
  };

  const displayUser = user ?? currentUser;
  const initials = displayUser
    ? `${displayUser.firstName?.[0] ?? ''}${displayUser.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';
  const roleLabel = displayUser?.role
    ? displayUser.role.charAt(0).toUpperCase() + displayUser.role.slice(1)
    : '';

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <Header />
      <main className="pt-[var(--header-height)]">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
          {/* Profile header section */}
          <div className="mb-8">
            <div className="relative mb-6 inline-block">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl font-semibold text-white">
                {displayUser?.avatar ? (
                  <img
                    src={displayUser.avatar}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100"
                aria-label="Change photo"
              >
                <span className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-800">
                  <Camera className="h-4 w-4" />
                  Change Photo
                </span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {displayUser?.firstName} {displayUser?.lastName}
            </h1>
            <p className="mt-1 text-slate-600">{displayUser?.email}</p>
            <span className="mt-2 inline-block rounded-full bg-[var(--color-primary-light)] px-3 py-0.5 text-sm font-medium text-[var(--color-primary)]">
              {roleLabel}
            </span>
          </div>

          {/* Form sections */}
          <form onSubmit={handleSaveChanges} className="space-y-6">
            {/* Personal Info */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Personal Info
              </h2>
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-slate-700"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={displayUser?.email ?? ''}
                    readOnly
                    className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Notification Preferences */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Notification Preferences
              </h2>
              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Email notifications
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={emailNotifications}
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      emailNotifications
                        ? 'bg-[var(--color-primary)]'
                        : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Daily digest
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={dailyDigest}
                    onClick={() => setDailyDigest(!dailyDigest)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      dailyDigest ? 'bg-[var(--color-primary)]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        dailyDigest ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Instant notifications
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={instantNotifications}
                    onClick={() => setInstantNotifications(!instantNotifications)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      instantNotifications
                        ? 'bg-[var(--color-primary)]'
                        : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        instantNotifications
                          ? 'translate-x-5'
                          : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </section>

            {/* Account - Change password */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Account</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Current password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-slate-700"
                  >
                    New password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Update Password
                </button>
              </div>
            </section>

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
