import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@/services';

interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      setSession: (session) => set({ session, isAuthenticated: true }),
      clearSession: () => set({ session: null, isAuthenticated: false }),
    }),
    { name: 'aureon-auth' },
  ),
);
