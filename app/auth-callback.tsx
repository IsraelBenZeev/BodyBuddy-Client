import { useAuthStore } from '@/src/store/useAuthStore';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();
  const navigated = useRef(false);

  // חובה לסגירת Custom Tab על Android
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  // timeout fallback — אם authService לא ניווט תוך 10 שניות, חזור ל-login
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!navigated.current) {
        navigated.current = true;
        useAuthStore.getState().setPendingAuthUrl(null);
        router.replace('/auth/login/[params]' as never);
      }
    }, 10_000);

    return () => clearTimeout(fallbackTimer);
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0d1117', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#ffffff" />
    </View>
  );
}
