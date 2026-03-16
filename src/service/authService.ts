import { useAuthStore } from '@/src/store/useAuthStore';
import { getProfile } from '@/src/service/profileService';
import { supabase } from '@/supabase_client';
import { Session, User } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
// import { supabase } from '@/src/lib/supabase'; // וודא שהנתיב נכון
interface AuthResponse {
  data: { user: User | null; session: Session | null } | null;
  error: Error | null;
}

interface ErrorResponse {
  error: Error | null;
}

// Email/Password Authentication
export const signUpWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    if (__DEV__) console.error('Sign up error:', error);
    return { data: null, error: error as Error };
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    if (__DEV__) console.error('Sign in error:', error);
    return { data: null, error: error as Error };
  }
};

export const signOut = async (): Promise<ErrorResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    if (__DEV__) console.error('Sign out error:', error);
    return { error: error as Error };
  }
};

// User Management
export const getCurrentUser = async (): Promise<{
  user: User | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    if (__DEV__) console.error('Get user error:', error);
    return { user: null, error: error as Error };
  }
};

export const getCurrentSession = async (): Promise<{
  session: Session | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    if (__DEV__) console.error('Get session error:', error);
    return { session: null, error: error as Error };
  }
};

/** מפרסר טוקנים מ-URL של redirect (hash או query) */
function parseTokensFromRedirectUrl(
  url: string
): { access_token: string; refresh_token: string } | null {
  try {
    const hasHash = url.includes('#');
    const fragmentOrQuery = hasHash ? (url.split('#')[1] ?? '') : (url.split('?')[1] ?? '');
    const params = new URLSearchParams(fragmentOrQuery);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (access_token && refresh_token) return { access_token, refresh_token };
  } catch {
    // ignore
  }
  return null;
}

/**
 * מאזין ל-deep link URL שמגיע דרך Linking — fallback לאנדרואיד
 * כש-openAuthSessionAsync מחזיר dismiss במקום success (באג ידוע של Expo)
 */
function waitForRedirectUrl(timeoutMs: number): {
  promise: Promise<string | null>;
  cleanup: () => void;
} {
  let subscription: ReturnType<typeof Linking.addEventListener> | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let resolved = false;

  const promise = new Promise<string | null>((resolve) => {
    subscription = Linking.addEventListener('url', ({ url }) => {
      if (!resolved && url && url.includes('access_token')) {
        resolved = true;
        if (timeoutId) clearTimeout(timeoutId);
        resolve(url);
      }
    });
    timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    }, timeoutMs);
  });

  const cleanup = () => {
    resolved = true;
    if (subscription) subscription.remove();
    if (timeoutId) clearTimeout(timeoutId);
  };

  return { promise, cleanup };
}

export const signInWithGoogle = async () => {
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  const redirectUrl = isExpoGo
    ? Linking.createURL('/auth-callback')
    : makeRedirectUri({ scheme: 'bodybuddy', path: 'auth-callback' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    if (__DEV__) console.error('Auth error:', error.message);
    return;
  }

  if (data?.url) {
    // רישום listener ללכידת URL מ-deep link לפני פתיחת הדפדפן (Android fallback)
    const { promise: linkingUrlPromise, cleanup } = waitForRedirectUrl(120_000);

    try {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      // קבלת URL — מ-openAuthSessionAsync (iOS) או מ-Linking listener (Android)
      let authUrl: string | null = null;
      if (result.type === 'success' && result.url) {
        authUrl = result.url;
      } else if (result.type === 'dismiss') {
        authUrl = await linkingUrlPromise;
      }

      cleanup();

      if (!authUrl) return; // המשתמש ביטל או timeout

      const tokens = parseTokensFromRedirectUrl(authUrl);
      if (!tokens) return;

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      if (sessionError) {
        if (__DEV__) console.error('setSession error:', sessionError.message);
        return;
      }

      if (sessionData?.session) {
        useAuthStore.getState().setUser(sessionData.session.user);
        useAuthStore.getState().setSession(sessionData.session);
        try {
          const profile = await getProfile(sessionData.session.user.id);
          if (profile?.full_name && profile.age != null) {
            router.replace('/(tabs)');
          } else {
            router.replace('/UserSetup');
          }
        } catch {
          router.replace('/UserSetup');
        }
      }
    } catch (err) {
      cleanup();
      if (__DEV__) console.error('signInWithGoogle error:', err);
    }
  }
};
