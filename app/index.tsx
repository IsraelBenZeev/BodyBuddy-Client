import { useAuthStore } from '@/src/store/useAuthStore';
import ActionButton from '@/src/ui/ActionButton';
import BodyBuddyLogo from '@/src/ui/BodyBuddyLogo';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

export default function IntroScreen() {
  const router = useRouter();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const initializationError = useAuthStore((s) => s.initializationError);
  const isLoading = useAuthStore((s) => s.isLoading);
  const animationDone = useRef(false);
  const authDone = useRef(false);
  const navigated = useRef(false);

  const navigate = useCallback(() => {
    if (navigated.current) return;
    navigated.current = true;
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      router.replace('/(tabs)');
    } else {
      router.replace({
        pathname: '/auth/login/[params]',
        params: { params: 'AUTH_PARAM' },
      } as never);
    }
  }, [router]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // המתן לסיום האנימציה (650ms עיכוב + 400ms אנימציה + מרווח)
  useEffect(() => {
    const timer = setTimeout(() => {
      animationDone.current = true;
      if (authDone.current) navigate();
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  // האזן לסיום אתחול ה-auth
  useEffect(() => {
    if (!isInitialized || initializationError) {
      authDone.current = false;
      return;
    }
    authDone.current = true;
    if (animationDone.current) navigate();
  }, [initializationError, isInitialized, navigate]);

  if (initializationError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-1200 px-7">
        <BodyBuddyLogo width={150} height={175} />

        <View className="mt-8 w-full max-w-md items-center rounded-3xl border border-white/10 bg-background-900 px-6 py-7">
          <View className="mb-5 h-16 w-16 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10">
            <Ionicons name="cloud-offline-outline" size={32} color="#bef264" />
          </View>

          <Text className="typo-h2 text-center text-white">אין חיבור לאינטרנט</Text>
          <Text className="typo-body mt-3 text-center text-background-300">
            {initializationError}
          </Text>

          <ActionButton
            className="mt-7"
            label="נסה שוב"
            iconName="refresh-outline"
            size="md"
            fullWidth
            loading={isLoading}
            onPress={() => useAuthStore.getState().initialize()}
            accessibilityHint="מנסה להתחבר מחדש ולאתחל את האפליקציה"
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0d1117',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BodyBuddyLogo width={220} height={255} />
    </View>
  );
}
