import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/supabase_client';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial State
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,

  // Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearAuth: () => set({ user: null, session: null }),

  // Initialize: טעינת session קיים + listener לשינויים
  initialize: async () => {
    set({ isLoading: true });

    // טעינת session קיים מAsyncStorage
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      set({
        user: session.user,
        session,
      });
    }

    // Listener לשינויי auth state (login/logout/refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        session: session ?? null,
      });
    });

    set({ isLoading: false, isInitialized: true });
  },
}));
