import { useAuthStore } from '@/src/store/useAuthStore';
import BodyBuddyLogo from '@/src/ui/BodyBuddyLogo';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

export default function IntroScreen() {
  const router = useRouter();
  const isInitialized = useAuthStore((s) => s.isInitialized);
const animationDone = useRef(false);
  const authDone = useRef(false);
  const navigated = useRef(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // המתן לסיום האנימציה (650ms עיכוב + 400ms אנימציה + מרווח)
  useEffect(() => {
    const timer = setTimeout(() => {
      animationDone.current = true;
      if (authDone.current) navigate();
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // האזן לסיום אתחול ה-auth
  useEffect(() => {
    if (!isInitialized) return;
    authDone.current = true;
    if (animationDone.current) navigate();
  }, [isInitialized]);

  function navigate() {
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
      <BodyBuddyLogo width={260} height={182} />
    </View>
  );
}
