import { create } from 'zustand';
import { User, Session, Subscription } from '@supabase/supabase-js';
import { supabase } from '@/supabase_client';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  pendingAuthUrl: string | null;
  _authSubscription: Subscription | null;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setPendingAuthUrl: (url: string | null) => void;
  clearAuth: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  pendingAuthUrl: null,
  _authSubscription: null,

  // Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  setPendingAuthUrl: (url) => set({ pendingAuthUrl: url }),
  clearAuth: () => set({ user: null, session: null }),

  // Initialize: טעינת session קיים + listener לשינויים
  initialize: async () => {
    // ביטול listener קודם למניעת דליפת זיכרון
    get()._authSubscription?.unsubscribe();

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        session: session ?? null,
      });
    });

    set({ isLoading: false, isInitialized: true, _authSubscription: subscription });
  },
}));
