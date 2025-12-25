import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QueryClientManager } from 'reactotron-react-query';
import Reactotron from '../ReactotronConfig';
import '../global.css'; // כאן אנחנו "מחברים את החשמל" (Tailwind)
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
          {/* <StatusBar /> */}
          <Stack screenOptions={{ headerShown: false }} />
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
