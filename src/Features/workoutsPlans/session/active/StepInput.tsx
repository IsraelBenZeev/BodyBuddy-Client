import AppButton from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  step?: number;
  disabled?: boolean;
  formatValue?: (n: number) => string;
  shouldUnregister?: boolean;
}

const StepInput = ({
  control,
  name,
  label,
  step = 1,
  disabled = false,
  formatValue,
  shouldUnregister,
}: Props) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLongPressing = useRef(false);
  const [isStepTenEnabled, setIsStepTenEnabled] = useState(false);
  const currentStep = isStepTenEnabled ? step * 10 : step;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const updateValue = (currentValue: number, delta: number, onChange: (v: number) => void) => {
    const safeCurrentValue = Number(currentValue) || 0;
    const newValue = Math.max(0, safeCurrentValue + delta);

    if (safeCurrentValue === 0 && delta < 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return safeCurrentValue;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(newValue);
    return newValue;
  };

  const handlePress = (currentValue: number, delta: number, onChange: (v: number) => void) => {
    if (isLongPressing.current) {
      isLongPressing.current = false;
      return;
    }

    updateValue(currentValue, delta, onChange);
  };

  const handleLongPressStart = (
    currentValue: number,
    delta: number,
    onChange: (v: number) => void
  ) => {
    isLongPressing.current = true;
    let latestValue = currentValue;

    timerRef.current = setInterval(() => {
      latestValue = updateValue(latestValue, delta, onChange);
    }, 100);
  };

  const handleLongPressEnd = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <View className="flex-1 items-center justify-center gap-2">
      <View className="flex-row items-center gap-2 self-start">
        <Text className="typo-caption-bold text-zinc-400 uppercase">{label}</Text>
        <AppButton
          onPress={() => setIsStepTenEnabled((prev) => !prev)}
          className={`rounded-full border px-2 py-1 ${
            isStepTenEnabled
              ? 'border-lime-500/60 bg-lime-500/20'
              : 'border-white/10 bg-background-800'
          }`}
          haptic="light"
          animationType="both"
          accessibilityLabel={`${isStepTenEnabled ? 'בטל' : 'הפעל'} קפיצה של 10 עבור ${label}`}
        >
          <Text className={`typo-caption ${isStepTenEnabled ? 'text-lime-400' : 'text-zinc-400'}`}>
            10+
          </Text>
        </AppButton>
      </View>

      <Controller
        control={control}
        name={name}
        shouldUnregister={shouldUnregister}
        render={({ field: { onChange, value = 0 } }) => (
          <View className="flex-row items-center bg-zinc-900 rounded-2xl border border-white/5">
            <AppButton
              disabled={disabled}
              onPress={() => handlePress(value, currentStep, onChange)}
              onLongPress={() => handleLongPressStart(value, currentStep, onChange)}
              onPressOut={handleLongPressEnd}
              delayLongPress={300}
              className="bg-lime-500/20 border border-lime-500/45 rounded-full p-2"
              haptic="medium"
              animationType="both"
              accessibilityLabel={`הגדל ${label}`}
              hitSlop={6}
            >
              <MaterialCommunityIcons name="plus" size={24} color="rgb(213,255,95)" />
            </AppButton>

            <View className="px-4 min-w-[30px] items-center justify-center">
              {formatValue ? (
                <Text className="text-4xl font-black text-white">{formatValue(Number(value))}</Text>
              ) : (
                <AnimatedNumbers
                  includeComma={false}
                  animateToNumber={Number(value)}
                  fontStyle={{
                    fontSize: 24,
                    fontWeight: '900',
                    color: 'white',
                  }}
                  animationDuration={300}
                />
              )}
            </View>

            <AppButton
              disabled={disabled}
              onPress={() => handlePress(value, -currentStep, onChange)}
              onLongPress={() => handleLongPressStart(value, -currentStep, onChange)}
              onPressOut={handleLongPressEnd}
              delayLongPress={300}
              className="bg-background-800 border border-white/10 rounded-full p-2"
              haptic="medium"
              animationType="both"
              accessibilityLabel={`הפחת ${label}`}
              hitSlop={6}
            >
              <MaterialCommunityIcons name="minus" size={24} color="white" />
            </AppButton>
          </View>
        )}
      />
    </View>
  );
};

export default StepInput;
