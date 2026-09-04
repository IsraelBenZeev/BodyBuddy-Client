import AppButton from '@/src/ui/PressableOpacity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  disabled?: boolean;
  shouldUnregister?: boolean;
}

const DurationInput = ({ control, name, label, disabled = false, shouldUnregister }: Props) => {
  const [isStepTenEnabled, setIsStepTenEnabled] = useState(false);

  const updateValue = (value: unknown, delta: number, onChange: (value: number) => void) => {
    const currentValue = Number(value) || 0;
    const nextValue = Math.max(0, currentValue + delta);

    if (nextValue === currentValue && delta < 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(nextValue);
  };

  return (
    <View className="flex-1 items-center gap-2">
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
        render={({ field: { onChange, value = 0 } }) => {
          const totalSeconds = Math.max(0, Number(value) || 0);

          const TimeUnit = ({ amount, unit, step }: { amount: number; unit: string; step: number }) => {
            const activeStep = isStepTenEnabled ? step * 10 : step;

            return (
              <View className="flex-1 items-center gap-2">
                <Text className="typo-caption text-zinc-500">{unit}</Text>
                <View className="flex-row items-center rounded-2xl border border-white/5 bg-zinc-900 p-1">
                  <AppButton
                    disabled={disabled}
                    onPress={() => updateValue(totalSeconds, activeStep, onChange)}
                    className="rounded-full border border-lime-500/45 bg-lime-500/20 p-2"
                    haptic="medium"
                    animationType="both"
                    accessibilityLabel={`הוסף ${unit}`}
                    hitSlop={6}
                  >
                    <MaterialCommunityIcons name="plus" size={22} color="rgb(213,255,95)" />
                  </AppButton>
                  <Text className="min-w-[44px] text-center text-3xl font-black text-white">
                    {String(amount).padStart(2, '0')}
                  </Text>
                  <AppButton
                    disabled={disabled}
                    onPress={() => updateValue(totalSeconds, -activeStep, onChange)}
                    className="rounded-full border border-white/10 bg-background-800 p-2"
                    haptic="medium"
                    animationType="both"
                    accessibilityLabel={`הפחת ${unit}`}
                    hitSlop={6}
                  >
                    <MaterialCommunityIcons name="minus" size={22} color="white" />
                  </AppButton>
                </View>
              </View>
            );
          };

          return (
            <View className="w-full flex-row items-end gap-3">
              <TimeUnit amount={Math.floor(totalSeconds / 60)} unit="דקות" step={60} />
              <Text className="pb-3 text-2xl font-black text-zinc-500">:</Text>
              <TimeUnit amount={totalSeconds % 60} unit="שניות" step={1} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default DurationInput;
