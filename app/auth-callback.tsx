import { supabase } from '@/supabase_client';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // אנחנו שומרים את ה-subscription כדי שנוכל לבטל אותו
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event); // כלי מעולה לדיבאג בקרסר

      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        router.replace('/(tabs)'); 
      }
    });

    // פונקציית Cleanup - חשוב מאוד!
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null; 
}