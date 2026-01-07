import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientManager } from 'reactotron-react-query';
import Reactotron from '../ReactotronConfig';
import '../global.css'; // כאן אנחנו "מחברים את החשמל" (Tailwind)
import Toast from 'react-native-toast-message';
import ToastConfig from '@/ToastConfig';
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
  return (
    // GestureHandlerRootView חייב להיות בדרגה הכי גבוהה כדי שהגרירה תעבוד
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={styles.container} className="bg-background-1200 flex-1 w-full">
          <StatusBar />
          {/* <Stack screenOptions={{ headerShown: false }} /> */}
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              presentation: 'modal',
              animation: 'slide_from_bottom',
              // gestureDirection: 'vertical',
              // animationDuration: 500,
              // freezeOnBlur: true,
              // headerBackTitle: 'Back',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="exercise/[exerciseId]" />
            <Stack.Screen
              name="form_create_Workout/[mode]"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
        </SafeAreaView>
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
