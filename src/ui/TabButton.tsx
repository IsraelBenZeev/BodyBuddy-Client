import { colors } from '@/colors';
import { usePathname } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface TabButtonProps {
  routeName: string;
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  label: string;
}

const TabButton = ({ routeName, children, onPress, label }: TabButtonProps) => {
  const pathname = usePathname();

  const focused = pathname === routeName || (pathname === '/' && routeName === '/index');
  const viewRef = useRef<any>(null);

  useEffect(() => {
    if (focused) {
      viewRef.current?.animate({
        0: { scale: 1, translateY: 0 },
        1: { scale: 1.1, translateY: -15 }, // הקפיצה למעלה
      });
    } else {
      viewRef.current?.animate({
        0: { scale: 1.1, translateY: -15 },
        1: { scale: 1, translateY: 0 },
      });
    }
  }, [focused]);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.contentWrapper} className="">
        <Animatable.View
          ref={viewRef}
          duration={300}
          style={[styles.btn, { backgroundColor: focused ? colors.lime[400] : 'transparent' }]}
        >
          {children}
        </Animatable.View>

        <Text style={[styles.labelText, { color: focused ? colors.lime[400] : colors.background[100] }]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // ממרכז את כל החבילה בתוך הטאב-בר
    alignItems: 'center',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // כאן אפשר להוסיף paddingBottom קטן אם זה מרגיש נמוך מדי בבר
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    marginTop: -10, // מספר שלילי "ימשוך" את הטקסט למעלה לכיוון האייקון
    fontWeight: '600',
  },
});
export default TabButton;
