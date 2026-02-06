import { useAuthStore } from '@/src/store/useAuthStore';
import { supabase } from '@/supabase_client';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Session, User } from '@supabase/supabase-js';
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
    console.error('Sign up error:', error);
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
    console.error('Sign in error:', error);
    return { data: null, error: error as Error };
  }
};

export const signOut = async (): Promise<ErrorResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
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
    console.error('Get user error:', error);
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
    console.error('Get session error:', error);
    return { session: null, error: error as Error };
  }
};




/** מפרסר טוקנים מ-URL של redirect (hash או query) */
function parseTokensFromRedirectUrl(url: string): { access_token: string; refresh_token: string } | null {
  try {
    const hasHash = url.includes('#');
    const fragmentOrQuery = hasHash ? url.split('#')[1] ?? '' : url.split('?')[1] ?? '';
    const params = new URLSearchParams(fragmentOrQuery);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (access_token && refresh_token) return { access_token, refresh_token };
  } catch {
    // ignore
  }
  return null;
}

export const signInWithGoogle = async () => {
  const redirectUrl = Linking.createURL('/auth-callback');

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
    console.error('Auth error:', error.message);
    return;
  }

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type === 'success' && result.url) {
      const tokens = parseTokensFromRedirectUrl(result.url);
      if (tokens) {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
        if (sessionError) {
          console.error('setSession error:', sessionError.message);
          return;
        }
        if (sessionData?.session) {
          useAuthStore.getState().setUser(sessionData.session.user);
          useAuthStore.getState().setSession(sessionData.session);
          router.replace('/(tabs)');
        }
      }
    }
  }
};