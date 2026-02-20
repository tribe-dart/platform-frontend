'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  UserPlus,
  Search,
  ArrowLeft,
  Users,
  GraduationCap,
  Loader2,
  X,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

interface Programme {
  _id: string;
  title: string;
  institution: string;
}

interface UserOption {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Enrollment {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string };
  programmeId: { _id: string; title: string; institution: string };
  role: 'student' | 'instructor' | 'ta';
  status: string;
  enrolledAt: string;
}

export default function EnrollmentsAdminPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addRole, setAddRole] = useState<'student' | 'instructor'>('student');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [userSearch, setUserSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProgrammes = async () => {
      try {
        const data = await apiFetch('/programmes');
        setProgrammes(data || []);
        if (data && data.length > 0) {
          setSelectedProgramme(data[0]._id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    loadProgrammes();
  }, []);

  const loadEnrollments = useCallback(async () => {
    if (!selectedProgramme) return;
    try {
      setLoading(true);
      const data = await apiFetch(`/enrollments/admin/programme/${selectedProgramme}`);
      setEnrollments(data.enrollments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedProgramme]);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const loadUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      const data = await apiFetch(`/admin/users?${params.toString()}`);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, [userSearch]);

  useEffect(() => {
    if (showAddModal) {
      loadUsers();
    }
  }, [showAddModal, loadUsers]);

  const handleAdd = async () => {
    if (!selectedUser || !selectedProgramme) return;

    try {
      const endpoint = addRole === 'student' ? '/enrollments/admin/add-student' : '/enrollments/admin/add-instructor';
      await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ userId: selectedUser, programmeId: selectedProgramme }),
      });
      setSuccess(`${addRole === 'student' ? 'Student' : 'Instructor'} added successfully`);
      setShowAddModal(false);
      setSelectedUser('');
      loadEnrollments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (enrollmentId: string, userName: string) => {
    if (!confirm(`Remove ${userName} from this programme?`)) return;

    try {
      await apiFetch(`/enrollments/admin/${enrollmentId}`, { method: 'DELETE' });
      setSuccess(`${userName} removed from programme`);
      loadEnrollments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const roleColors = {
    student: 'bg-blue-100 text-blue-700',
    instructor: 'bg-purple-100 text-purple-700',
    ta: 'bg-cyan-100 text-cyan-700',
  };

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Programme Enrollments</h1>
              <p className="mt-1 text-slate-500">
                Manage student and instructor enrollments
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!selectedProgramme}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <p className="text-sm">{error}</p>
            <button onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <p className="text-sm">{success}</p>
            <button onClick={() => setSuccess(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Programme
          </label>
          <select
            value={selectedProgramme}
            onChange={(e) => setSelectedProgramme(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          >
            {programmes.map((prog) => (
              <option key={prog._id} value={prog._id}>
                {prog.title} - {prog.institution}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Users className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No enrollments for this programme</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Programme Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{enrollment.userId.name}</p>
                        <p className="text-sm text-slate-500">{enrollment.userId.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          roleColors[enrollment.role]
                        }`}
                      >
                        {enrollment.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRemove(enrollment._id, enrollment.userId.name)}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add User to Programme</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAddRole('student')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition-colors ${
                      addRole === 'student'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddRole('instructor')}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition-colors ${
                      addRole === 'instructor'
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Instructor
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search User
                </label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!selectedUser}
                  className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                >
                  Add {addRole === 'student' ? 'Student' : 'Instructor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
