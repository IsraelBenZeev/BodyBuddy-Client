import { logError } from '@/src/lib/logger';
import { useAuthStore } from '@/src/store/useAuthStore';
import { recordPrivacyConsent } from '@/src/service/consentService';
import { deletePushToken } from '@/src/service/pushTokenService';
import { getProfile } from '@/src/service/profileService';
import { getPrivacyPolicy } from '@/src/service/privacyPolicyService';
import { getDeviceId } from '@/src/utils/deviceId';
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
    logError(error, 'signUpWithEmail');
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
    logError(error, 'signInWithEmail');
    return { data: null, error: error as Error };
  }
};

export const signOut = async (): Promise<ErrorResponse> => {
  try {
    // חייב לרוץ לפני signOut בפועל — אחרי זה auth.uid() כבר null וה-RLS יחסום את המחיקה
    const deviceId = await getDeviceId();
    await deletePushToken(deviceId);

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    logError(error, 'signOut');
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
    logError(error, 'getCurrentUser');
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
    logError(error, 'getCurrentSession');
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
      if (!resolved && url && (url.includes('access_token') || url.includes('code='))) {
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
    logError(error, 'signInWithGoogle/oauth');
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

      // PKCE flow מחזיר code= בלי access_token; Implicit flow מחזיר access_token ב-hash
      const isPKCE = authUrl.includes('code=') && !authUrl.includes('access_token');
      let sessionData: Awaited<ReturnType<typeof supabase.auth.setSession>>['data'] | null = null;

      if (isPKCE) {
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(authUrl);
        if (sessionError) {
          logError(sessionError, 'exchangeCodeForSession');
          return;
        }
        sessionData = data;
      } else {
        const tokens = parseTokensFromRedirectUrl(authUrl);
        if (!tokens) return;
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
        if (sessionError) {
          logError(sessionError, 'setSession');
          return;
        }
        sessionData = data;
      }

      if (sessionData?.session) {
        useAuthStore.getState().setUser(sessionData.session.user);
        useAuthStore.getState().setSession(sessionData.session);
        try {
          const policy = await getPrivacyPolicy();
          recordPrivacyConsent(sessionData.session.user.id, policy.version);
        } catch {
          // best effort - כבר נרשם ל-logger בתוך getPrivacyPolicy
        }
        try {
          const profile = await getProfile(sessionData.session.user.id);
          if (profile?.full_name && (profile.date_of_birth != null || profile.age != null)) {
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
      logError(err, 'signInWithGoogle');
    }
  }
};
