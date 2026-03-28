import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

interface CountdownModalProps {
  visible: boolean;
  onCancel: () => void;
  onStart: () => void;
}

const COUNTDOWN_START = 3;

const countColor: Record<number, string> = {
  3: '#ffffff',
  2: '#a3e635', // lime-400
  1: '#bef264', // lime-300
};

const CountdownModal = ({ visible, onCancel, onStart }: CountdownModalProps) => {
  const [count, setCount] = useState(COUNTDOWN_START);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    clearTimer();
    setCount(COUNTDOWN_START);
    onCancel();
  }, [clearTimer, onCancel]);

  const handleStart = useCallback(() => {
    clearTimer();
    setCount(COUNTDOWN_START);
    onStart();
  }, [clearTimer, onStart]);

  useEffect(() => {
    if (!visible) return;

    setCount(COUNTDOWN_START);

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [visible, clearTimer]);

  useEffect(() => {
    if (count === 0 && visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onStart();
    }
  }, [count, visible, onStart]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} className="bg-black/80 justify-center items-center px-8">
      <Animated.View
        entering={FadeIn.duration(300)}
        className="w-full items-center"
      >
        {/* כותרת */}
        <Text className="text-zinc-400 text-lg font-semibold mb-2 tracking-widest uppercase">
          מתכוננים
        </Text>

        {/* ספרה */}
        <Animated.Text
          key={count}
          entering={ZoomIn.duration(400).springify()}
          style={{ color: countColor[count] ?? '#ffffff', fontSize: 120, fontWeight: '900', lineHeight: 130 }}
        >
          {count > 0 ? count : '🔥'}
        </Animated.Text>

        {/* כיתוב תחתון */}
        <Text className="text-zinc-500 text-base mt-2 mb-10">
          האימון מתחיל עוד רגע...
        </Text>

        {/* כפתורים */}
        <View className="flex-row gap-4 w-full">
          <Pressable
            onPress={handleCancel}
            className="flex-1 py-4 rounded-2xl border border-zinc-600 items-center"
          >
            <Text className="text-zinc-300 font-bold text-base">ביטול</Text>
          </Pressable>

          <Pressable
            onPress={handleStart}
            className="flex-1 py-4 rounded-2xl bg-lime-500 items-center"
          >
            <Text className="text-black font-black text-base">התחל עכשיו</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default CountdownModal;
