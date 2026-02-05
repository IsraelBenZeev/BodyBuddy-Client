import { supabase } from '@/supabase_client';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
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

// TODO: Google OAuth - למימוש בשלב נפרד
WebBrowser.maybeCompleteAuthSession();

// export const authService = {
//   signInWithGoogle: async () => {
//     try {
//       // 1. יצירת ה-Redirect URL - אקספו יודעת לייצר כתובת שתחזור לאפליקציה
//       const redirectUrl = AuthSession.makeRedirectUri();

//       // 2. קריאה לסופבייס לקבלת לינק להתחברות
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//           redirectTo: redirectUrl,
//           skipBrowserRedirect: true, // אנחנו ננהל את פתיחת הדפדפן בעצמנו
//         },
//       });

//       if (error) throw error;

//       // 3. פתיחת הדפדפן למשתמש
//       const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

//       // 4. אם המשתמש חזר מהדפדפן, סופבייס יזהה את ה-Session אוטומטית דרך ה-Listener ב-Store
//       if (res.type === 'success' && res.url) {
//         const { params, errorCode } = AuthSession.parseErrorFromRedirect(res.url);
//         if (errorCode) throw new Error(errorCode);
        
//         // שליפת הטוקנים מה-URL שחזר (סופבייס מטפל בזה בדרך כלל לבד ברקע)
//         const { access_token, refresh_token } = AuthSession.parseErrorFromRedirect(res.url);
//       }
      
//     } catch (error) {
//       console.error("Google Login Error:", error);
//       throw error;
//     }
//   }
// };
