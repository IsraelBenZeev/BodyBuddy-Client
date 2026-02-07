import { getProfile } from '@/src/service/profileService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { supabase } from '@/supabase_client';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';

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

export default function AuthCallback() {
  const router = useRouter();
  const url = Linking.useURL();

  /** בודק אם למשתמש יש פרופיל מלא ומנווט בהתאם */
  const navigateByProfile = useCallback(
    async (userId: string) => {
      try {
        const profile = await getProfile(userId);
        // אם יש פרופיל עם לפחות שם וגיל – הוא כבר מילא פרטים
        if (profile && profile.full_name && profile.age != null) {
          router.replace('/(tabs)');
        } else {
          router.replace('/UserSetup');
        }
      } catch {
        // במקרה של שגיאה – נשלח למילוי פרטים ליתר ביטחון
        router.replace('/UserSetup');
      }
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // מקרה 1: פתיחת אפליקציה דרך deep link (חזרה מגוגל כשהאפליקציה הייתה ברקע/סגורה)
      if (url) {
        const tokens = parseTokensFromRedirectUrl(url);
        if (tokens) {
          const { data, error } = await supabase.auth.setSession({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          });
          if (!cancelled && !error && data?.session) {
            useAuthStore.getState().setUser(data.session.user);
            useAuthStore.getState().setSession(data.session);
            await navigateByProfile(data.session.user.id);
            return;
          }
        }
      }

      // מקרה 2: כבר יש session (חזרנו מ-WebBrowser בתוך האפליקציה – authService עשה setSession ונווט לכאן)
      const { data: { session } } = await supabase.auth.getSession();
      if (!cancelled && session) {
        await navigateByProfile(session.user.id);
        return;
      }
    };

    run();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        await navigateByProfile(session.user.id);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [url, navigateByProfile]);

  return null;
}
