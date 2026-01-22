import AppButton from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; // ייבוא הרטט
import { useEffect, useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
interface Props {
  control: Control<any>;
  name: string;
  label: string;
  step?: number; // בכמה להעלות/להוריד בכל לחיצה
  disabled?: boolean;
}
const StepInput = ({ control, name, label, step = 1, disabled = false }: Props) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLongPressing = useRef(false); // דגל שמציין אם אנחנו בלחיצה ארוכה

  // ניקוי ה-interval כשהקומפוננטה נהרסת (למניעת memory leak)
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // פונקציה לעדכון הערך
  const updateValue = (currentValue: number, delta: number, onChange: (v: number) => void) => {
    const newValue = Math.max(0, (Number(currentValue) || 0) + delta);
    if (currentValue === 0 && delta < 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return currentValue;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(newValue);
    return newValue;
  };

  // לחיצה רגילה - רק אם לא היינו בלחיצה ארוכה
  const handlePress = (currentValue: number, delta: number, onChange: (v: number) => void) => {
    if (isLongPressing.current) {
      isLongPressing.current = false;
      return; // לא מעדכנים כי כבר עדכנו בלחיצה ארוכה
    }
    updateValue(currentValue, delta, onChange);
  };

  // התחלת לחיצה ארוכה (נקראת רק אחרי delayLongPress)
  const handleLongPressStart = (
    currentValue: number,
    delta: number,
    onChange: (v: number) => void
  ) => {
    isLongPressing.current = true;
    let latestValue = currentValue;
    // מפעילים אינטרוול שרץ כל 100 מילי-שניות
    timerRef.current = setInterval(() => {
      latestValue = updateValue(latestValue, delta, onChange);
    }, 100);
  };

  // עצירת הלחיצה
  const handleLongPressEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <View className="flex-1  items-center justify-center gap-2 ">
      <View className="flex-1">
        <Text className="text-zinc-400 text-xs font-bold uppercase">{label}</Text>
      </View>
      <View className="flex-1">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value = 0 } }) => (
            <View className="flex-row items-center bg-zinc-900 rounded-2xl border border-white/5">
              <AppButton
                disabled={disabled}
                onPress={() => handlePress(value, -step, onChange)}
                onLongPress={() => handleLongPressStart(value, -step, onChange)}
                onPressOut={handleLongPressEnd}
                delayLongPress={300}
                className={'bg-background-800 rounded-full p-2'}
                haptic="medium"
                animationType="both"
              >
                <MaterialCommunityIcons name="minus" size={24} color="white" />
              </AppButton>

              <View className="px-4 min-w-[30px] items-center justify-center">
                <AnimatedNumbers
                  includeComma={false}
                  animateToNumber={Number(value)}
                  fontStyle={{
                    fontSize: 24,
                    fontWeight: '900',
                    color: 'white',
                    fontStyle: 'italic',
                  }}
                  animationDuration={300} // מהירות הגלילה (במילי-שניות)
                />
              </View>

              <AppButton
                disabled={disabled}
                onPress={() => handlePress(value, step, onChange)}
                onLongPress={() => handleLongPressStart(value, step, onChange)}
                onPressOut={handleLongPressEnd}
                delayLongPress={300}
                className={'bg-lime-500 rounded-full p-2'}
                haptic="medium"
                animationType="both"
              >
                <MaterialCommunityIcons name="plus" size={24} color="black" />
              </AppButton>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default StepInput;
