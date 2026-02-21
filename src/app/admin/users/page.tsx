'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  GraduationCap,
  User,
  X,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  bio?: string;
  createdAt: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter) params.append('role', roleFilter);

      const data = await apiFetch(`/admin/users?${params.toString()}`);
      setUsers(data.users || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (user: UserData) => {
    if (!confirm(`Delete user "${user.name}"? This action cannot be undone.`)) return;

    try {
      await apiFetch(`/admin/users/${user._id}`, { method: 'DELETE' });
      setSuccess(`User "${user.name}" deleted successfully`);
      loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const roleIcons = {
    student: <User className="h-4 w-4" />,
    instructor: <GraduationCap className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
  };

  const roleColors = {
    student: 'bg-blue-100 text-blue-700',
    instructor: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-(--surface-bg)">
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">User Management</h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Manage all platform users and their roles
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--color-primary-hover) sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create User
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <p className="text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <p className="text-sm">{success}</p>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Users className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white sm:overflow-x-auto">
            <table className="w-full responsive-table">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 sm:px-6 sm:py-4" data-label="User">
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4" data-label="Role">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          roleColors[user.role]
                        }`}
                      >
                        {roleIcons[user.role]}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 sm:px-6 sm:py-4" data-label="Created">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4" data-label="Actions">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
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

      {(showCreateModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowCreateModal(false);
            setEditingUser(null);
          }}
          onSuccess={(message) => {
            setSuccess(message);
            setShowCreateModal(false);
            setEditingUser(null);
            loadUsers();
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

function UserModal({
  user,
  onClose,
  onSuccess,
  onError,
}: {
  user: UserData | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'student');
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user) {
        const body: { name: string; email: string; role: string; bio: string; password?: string } = { name, email, role, bio };
        if (password) body.password = password;

        await apiFetch(`/admin/users/${user._id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        onSuccess(`User "${name}" updated successfully`);
      } else {
        await apiFetch('/admin/users', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, role, bio }),
        });
        onSuccess(`User "${name}" created successfully`);
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {user ? 'Edit User' : 'Create New User'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password {user && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!user}
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
              placeholder="••••••••"
              minLength={8}
            />
            {!user && (
              <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'student' | 'instructor' | 'admin')}
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Bio (optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20"
              placeholder="Brief description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-(--color-primary) px-4 py-2.5 font-medium text-white transition-colors hover:bg-(--color-primary-hover) disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {user ? 'Updating...' : 'Creating...'}
                </span>
              ) : user ? (
                'Update User'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
