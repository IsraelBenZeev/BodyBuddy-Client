import { colors } from '@/colors';
import { useAuthStore } from '@/src/store/useAuthStore';
import GlobalSuccess from '@/src/ui/Animations/GloabalSuccess';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QueryClientManager } from 'reactotron-react-query';
import '../global.css'; // כאן אנחנו "מחברים את החשמל" (Tailwind)
import Reactotron from '../ReactotronConfig';
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

  // רישום listener ל-Supabase auth + טעינת session קיים – בלי זה ה-store לא מתעדכן אחרי התחברות
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    // GestureHandlerRootView חייב להיות בדרגה הכי גבוהה כדי שהגרירה תעבוד
    <GestureHandlerRootView style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.background[1200] }} >
      <QueryClientProvider client={queryClient}>
        {/* <SafeAreaView style={styles.container} className="bg-background-1200 flex-1 w-full"> */}
        <StatusBar />
        {/* <Stack screenOptions={{ headerShown: false }} /> */}
        <GlobalSuccess />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="exercise/[exerciseId]"
            options={{
              presentation: 'pageSheet',
              animation: 'fade_from_bottom',
              animationDuration: 300,

            }} />
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
