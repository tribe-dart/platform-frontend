'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Mail,
  Send,
  ArrowLeft,
  Loader2,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

interface Programme {
  _id: string;
  title: string;
  institution: string;
}

interface Invitation {
  _id: string;
  email: string;
  role: 'student' | 'instructor' | 'ta';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  programmeId: { _id: string; title: string };
  invitedBy: { name: string };
  createdAt: string;
  expiresAt: string;
}

export default function InvitationsAdminPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
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

  const loadInvitations = useCallback(async () => {
    if (!selectedProgramme) return;
    try {
      setLoading(true);
      const data = await apiFetch(`/invitations/programme/${selectedProgramme}`);
      setInvitations(data.invitations || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedProgramme]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleResend = async (invitationId: string) => {
    try {
      await apiFetch(`/invitations/${invitationId}/resend`, { method: 'POST' });
      setSuccess('Invitation resent successfully');
      loadInvitations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = async (invitationId: string) => {
    if (!confirm('Cancel this invitation?')) return;
    try {
      await apiFetch(`/invitations/${invitationId}`, { method: 'DELETE' });
      setSuccess('Invitation cancelled');
      loadInvitations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-amber-600" />,
    accepted: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    expired: <XCircle className="h-4 w-4 text-red-600" />,
    cancelled: <XCircle className="h-4 w-4 text-slate-600" />,
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-green-100 text-green-700',
    expired: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-700',
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
              <h1 className="text-2xl font-bold text-slate-900">Invitations</h1>
              <p className="mt-1 text-slate-500">
                Send and manage programme invitations
              </p>
            </div>
            <button
              onClick={() => setShowSendModal(true)}
              disabled={!selectedProgramme}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send Invitation
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
        ) : invitations.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Mail className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No invitations for this programme</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <div
                key={inv._id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  {statusIcons[inv.status]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 truncate">{inv.email}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[inv.status]
                      }`}
                    >
                      {inv.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {inv.role}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Invited by {inv.invitedBy.name} •{' '}
                    {new Date(inv.createdAt).toLocaleDateString()}
                    {inv.status === 'pending' && (
                      <> • Expires {new Date(inv.expiresAt).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                {inv.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResend(inv._id)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      title="Resend"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCancel(inv._id)}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Cancel"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showSendModal && (
        <SendInvitationModal
          programmeId={selectedProgramme}
          onClose={() => setShowSendModal(false)}
          onSuccess={(message) => {
            setSuccess(message);
            setShowSendModal(false);
            loadInvitations();
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

function SendInvitationModal({
  programmeId,
  onClose,
  onSuccess,
  onError,
}: {
  programmeId: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiFetch('/invitations/send', {
        method: 'POST',
        body: JSON.stringify({ email, name, programmeId, role }),
      });
      onSuccess(`Invitation sent to ${email}`);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Send Invitation</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 rounded-lg border px-4 py-2.5 font-medium transition-colors ${
                  role === 'student'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`flex-1 rounded-lg border px-4 py-2.5 font-medium transition-colors ${
                  role === 'instructor'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Instructor
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-800">
              An email will be sent with a temporary password. The user must change it on first login.
            </p>
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
              className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Invitation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
