import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  label?: string;
  unit?: string;
}

const ValueStepper = ({ value, onChange, step = 1, min = 0, label, unit }: Props) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLongPressing = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const updateValue = (current: number, delta: number): number => {
    if (current <= min && delta < 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return current;
    }
    const newValue = Math.max(min, Math.round((current + delta) * 10) / 10);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(newValue);
    return newValue;
  };

  const handlePress = (delta: number) => {
    if (isLongPressing.current) {
      isLongPressing.current = false;
      return;
    }
    updateValue(value, delta);
  };

  const handleLongPressStart = (delta: number) => {
    isLongPressing.current = true;
    let latest = value;
    timerRef.current = setInterval(() => {
      latest = updateValue(latest, delta);
    }, 100);
  };

  const handleLongPressEnd = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const displayValue = value % 1 === 0 ? String(value) : value.toFixed(1);

  return (
    <View className="items-center">
      {label != null && (
        <Text className="typo-label text-background-400 mb-3 text-center">{label}</Text>
      )}
      <View className="flex-row items-center gap-5">
        <Pressable
          onPress={() => handlePress(-step)}
          onLongPress={() => handleLongPressStart(-step)}
          onPressOut={handleLongPressEnd}
          delayLongPress={300}
          className="w-12 h-12 items-center justify-center bg-background-700 rounded-full border border-background-600"
          accessibilityRole="button"
          accessibilityLabel={`הפחת ${label ?? ''}`}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="minus" size={22} color="white" />
        </Pressable>

        <View className="items-center" style={{ minWidth: 80 }}>
          <Text style={{ fontSize: 40, fontWeight: '900', color: 'white', lineHeight: 46 }}>
            {displayValue}
          </Text>
          {unit != null && (
            <Text className="typo-label text-background-400 mt-1">{unit}</Text>
          )}
        </View>

        <Pressable
          onPress={() => handlePress(step)}
          onLongPress={() => handleLongPressStart(step)}
          onPressOut={handleLongPressEnd}
          delayLongPress={300}
          className="w-12 h-12 items-center justify-center bg-lime-500 rounded-full"
          accessibilityRole="button"
          accessibilityLabel={`הגדל ${label ?? ''}`}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="plus" size={22} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

export default ValueStepper;
