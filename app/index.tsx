import Exercises from '@/src/Features/exercises/Exercises';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // חובה לעטוף בזה

export default function Page() {
  return (
    // GestureHandlerRootView חייב להיות בדרגה הכי גבוהה כדי שהגרירה תעבוד
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} className="bg-background-1200 flex-1 w-full">
        {/* <StatusBar /> */}
        <Exercises />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // direction: 'rtl', // שים לב: באנדרואיד זה עלול לעשות בעיות עם מודלים, עדיף להשתמש ב-textAlign
  },
});
