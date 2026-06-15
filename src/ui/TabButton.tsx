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
        1: { scale: 1.08, translateY: -10 },
      });
    } else {
      viewRef.current?.animate({
        0: { scale: 1.08, translateY: -10 },
        1: { scale: 1, translateY: 0 },
      });
    }
  }, [focused]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
    >
      <View style={styles.contentWrapper}>
        <Animatable.View
          ref={viewRef}
          duration={300}
          style={[
            styles.btn,
            focused
              ? {
                  backgroundColor: 'rgba(150, 200, 40, 0.18)',
                  borderWidth: 1,
                  borderColor: 'rgba(150, 200, 40, 0.45)',
                }
              : {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: 'transparent',
                },
          ]}
        >
          {children}
        </Animatable.View>

        <Text
          className="typo-caption-bold -mt-2.5"
          style={{ color: focused ? colors.lime[300] : colors.background[400] }}
        >
          {label}
        </Text>
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
});
export default TabButton;
