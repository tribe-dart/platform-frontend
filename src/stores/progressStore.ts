'use client';
import { create } from 'zustand';

interface ProgressState {
  screenStatuses: Record<string, 'unread' | 'review' | 'done'>;
  setScreenStatus: (screenId: string, status: 'unread' | 'review' | 'done') => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  screenStatuses: {},
  setScreenStatus: (screenId, status) =>
    set((s) => ({ screenStatuses: { ...s.screenStatuses, [screenId]: status } })),
}));
