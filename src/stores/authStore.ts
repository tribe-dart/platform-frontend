'use client';
import { create } from 'zustand';
import type { User } from '@/types';
import { currentUser } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    set({ user: currentUser, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
