import { logError } from '@/src/lib/logger';
import { supabase } from '@/supabase_client';
import { Session, Subscription, User } from '@supabase/supabase-js';
import { create } from 'zustand';

const AUTH_INITIALIZATION_TIMEOUT_MS = 12_000;
const AUTH_CONNECTION_ERROR = 'לא הצלחנו להתחבר. בדוק את חיבור האינטרנט שלך ונסה שוב.';

const withTimeout = <T>(promise: PromiseLike<T>, timeoutMs: number): Promise<T> =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error('Auth initialization timed out')),
      timeoutMs
    );

    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  initializationError: string | null;
  pendingAuthUrl: string | null;
  _authSubscription: Subscription | null;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setPendingAuthUrl: (url: string | null) => void;
  clearAuth: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  initializationError: null,
  pendingAuthUrl: null,
  _authSubscription: null,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  setPendingAuthUrl: (url) => set({ pendingAuthUrl: url }),
  clearAuth: () => set({ user: null, session: null }),

  initialize: async () => {
    get()._authSubscription?.unsubscribe();
    set({
      isLoading: true,
      isInitialized: false,
      initializationError: null,
      _authSubscription: null,
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        void supabase.auth.signOut();
        return;
      }
      if (event === 'SIGNED_OUT') {
        set({ user: null, session: null });
        return;
      }
      set({
        user: session?.user ?? null,
        session: session ?? null,
        initializationError: null,
      });
    });

    try {
      // getSession refreshes an expired token when needed, which may require a network connection.
      const {
        data: { session },
        error,
      } = await withTimeout(supabase.auth.getSession(), AUTH_INITIALIZATION_TIMEOUT_MS);

      if (error) throw error;

      set({
        user: session?.user ?? null,
        session: session ?? null,
        initializationError: null,
      });
    } catch (error) {
      logError(error, 'authInitialization');
      set({ initializationError: AUTH_CONNECTION_ERROR });
    } finally {
      set({
        isLoading: false,
        isInitialized: true,
        _authSubscription: subscription,
      });
    }
  },
}));
