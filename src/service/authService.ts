import { supabase } from '@/supabase_client';
import { User, Session } from '@supabase/supabase-js';

interface AuthResponse {
  data: { user: User | null; session: Session | null } | null;
  error: Error | null;
}

interface ErrorResponse {
  error: Error | null;
}

// Email/Password Authentication
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
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

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
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

// TODO: Google OAuth - למימוש בשלב נפרד
export const signInWithGoogle = async (): Promise<never> => {
  throw new Error('Google OAuth not implemented yet');
};
