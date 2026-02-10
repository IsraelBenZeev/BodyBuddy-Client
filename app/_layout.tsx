import { colors } from '@/colors';
import { useAuthStore } from '@/src/store/useAuthStore';
import GlobalFaild from '@/src/ui/Animations/GloabalFaild';
import GlobalSuccess from '@/src/ui/Animations/GloabalSuccess';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QueryClientManager } from 'reactotron-react-query';
import '../global.css'; // כאן אנחנו "מחברים את החשמל" (Tailwind)
import Reactotron from '../ReactotronConfig';

// בתוך RootLayout
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // הנתונים נחשבים "טריים" ל-30 דקות
      gcTime: 1000 * 60 * 60 * 2, // שמירת הנתונים בזיכרון לשעה (גם אם הם לא בשימוש)
    },
  },
});

if (__DEV__) {
  new QueryClientManager({
    queryClient,
    // @ts-ignore
    reactotron: Reactotron,
  });
}

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const url = Linking.useURL();
  // רישום listener ל-Supabase auth + טעינת session קיים – בלי זה ה-store לא מתעדכן אחרי התחברות
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  // 2. טיפול בחזרה מגוגל (Deep Linking) – fallback כש-URL מגיע דרך Linking ולא מ-openAuthSessionAsync
  // useEffect(() => {
  //   const handleDeepLink = async () => {
  //     if (!url) return;
  //     const fragment = url.includes('#') ? (url.split('#')[1] ?? '') : '';
  //     if (!fragment) return;
  //     const params = new URLSearchParams(fragment);
  //     const access_token = params.get('access_token');
  //     const refresh_token = params.get('refresh_token');
  //     if (!access_token || !refresh_token) return;

  //     const { data, error } = await supabase.auth.setSession({
  //       access_token,
  //       refresh_token,
  //     });

  //     if (!error && data?.session) {
  //       useAuthStore.getState().setUser(data.session.user);
  //       useAuthStore.getState().setSession(data.session);
  //       router.replace('/UserSetup');
  //     }
  //   };

  //   handleDeepLink();
  // }, [url]);

  return (
    // GestureHandlerRootView חייב להיות בדרגה הכי גבוהה כדי שהגרירה תעבוד
    <GestureHandlerRootView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.background[1200] }}
    >
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
        {/* <SafeAreaView style={styles.container} className="bg-background-1200 flex-1 w-full"> */}
        <StatusBar />
        {/* <Stack screenOptions={{ headerShown: false }} /> */}
        <GlobalSuccess />
        <GlobalFaild />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
          <Stack.Screen name="UserSetup" />
          <Stack.Screen name="MealBuilder/[paramse]" />
          <Stack.Screen
            name="exercise/[exerciseId]"
            options={{
              presentation: 'pageSheet',
              animation: 'fade_from_bottom',
              animationDuration: 300,
            }}
          />
          <Stack.Screen
            name="form_create_Workout/[mode]"
            options={{
              presentation: 'modal',
              // headerShown: false,
            }}
          />
          <Stack.Screen
            name="workout_plan/[paramse]"
            options={{
              presentation: 'containedModal',
              animation: 'flip',
              animationDuration: 100,
              gestureEnabled: true,
              // headerShown: true, // וודא שזה true
              // headerLeft: () => (
              //   <Button
              //     title="סגור"
              //     onPress={() => router.back()} // פקודת החזרה
              //   />
              // ),
            }}
          />
        </Stack>
        {/* </SafeAreaView> */}
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

// הרכיב Stack אומר: "כאן אני אציג את הדפים של האפליקציה"
// הוא לא מציג שום דבר ויזואלי בעצמו, הוא רק מנהל את התצוגה.
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // direction: 'rtl', // שים לב: באנדרואיד זה עלול לעשות בעיות עם מודלים, עדיף להשתמש ב-textAlign
  },
});
