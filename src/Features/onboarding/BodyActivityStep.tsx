import { colors } from '@/colors';
import { ProfileFormData } from '@/src/types/profile';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import HorizontalRuler from './HorizontalRuler';

interface BodyActivityStepProps {
  control: Control<ProfileFormData>;
  trigger: UseFormTrigger<ProfileFormData>;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
}

const BodyActivityStep = ({
  control,
  trigger,
  onBack,
  onNext,
  onSubmit,
  isPending = false,
}: BodyActivityStepProps) => {
  const handleNext = useCallback(async () => {
    const isValid = await trigger(['height', 'weight']);
    if (isValid) onNext();
  }, [trigger, onNext]);

  const handleFinishAndSave = useCallback(async () => {
    if (!onSubmit) return;
    const isValid = await trigger(['height', 'weight']);
    if (isValid) onSubmit();
  }, [trigger, onSubmit]);

  return (
    <Animated.View entering={FadeInLeft.duration(400)} className="flex-1 px-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="typo-h1 text-white text-right mb-2">
          המדדים שלך
        </Text>
        <Text className="typo-h4 text-background-400 text-right">
          גובה ומשקל לחישוב מדויק של תוכניתך
        </Text>
      </View>

      <View>
        {/* Height - Horizontal Ruler */}
        <View className="mb-6">
          <Text className="typo-label text-background-200 text-right mb-3">
            גובה
          </Text>
          <Controller
            control={control}
            name="height"
            rules={{
              validate: (v) =>
                (v >= 100 && v <= 250) || 'גובה חייב להיות בין 100 ל-250 ס״מ',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <View className="bg-background-800 border border-background-600 rounded-2xl py-4 overflow-hidden">
                  <HorizontalRuler
                    min={100}
                    max={250}
                    value={value}
                    onChange={onChange}
                    unit="ס״מ"
                  />
                </View>
                {error && (
                  <Text className="typo-caption text-red-400 text-right mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Weight - Horizontal Ruler */}
        <View className="mb-6">
          <Text className="typo-label text-background-200 text-right mb-3">
            משקל
          </Text>
          <Controller
            control={control}
            name="weight"
            rules={{
              validate: (v) =>
                (v >= 20 && v <= 300) || 'משקל חייב להיות בין 20 ל-300 ק״ג',
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <View className="bg-background-800 border border-background-600 rounded-2xl py-4 overflow-hidden">
                  <HorizontalRuler
                    min={20}
                    max={300}
                    value={value}
                    onChange={onChange}
                    unit="ק״ג"
                  />
                </View>
                {error && (
                  <Text className="typo-caption text-red-400 text-right mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

      </View>

      {/* כפתורי פעולה – חזרה, הבא, סיום ושמירה */}
      <View className="mt-auto pt-1 pb-3 gap-2">
        <View className="flex-row gap-3">
          <Pressable
            onPress={onBack}
            disabled={isPending}
            className="flex-row items-center justify-center gap-1.5 flex-1 rounded-xl py-2 disabled:opacity-70 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="חזרה"
          >
            <Ionicons
              name="arrow-forward"
              size={16}
              color={colors.background[400]}
            />
            <Text className="typo-label text-background-400">חזרה</Text>
          </Pressable>

          <Pressable
            onPress={handleNext}
            disabled={isPending}
            className="flex-row items-center justify-center gap-2 flex-1 rounded-2xl py-3 shadow-lg bg-lime-500 disabled:opacity-70 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="הבא"
          >
            <Ionicons name="arrow-back" size={20} color={colors.background[900]} />
            <Text className="typo-btn-cta text-black">הבא</Text>
          </Pressable>
        </View>

        {onSubmit && (
          <Pressable
            onPress={handleFinishAndSave}
            disabled={isPending}
            className="flex-row items-center justify-center gap-2 py-2.5 rounded-xl border border-lime-500 bg-lime-500/15 disabled:opacity-70 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="סיום ושמירה"
          >
            {isPending ? (
              <ActivityIndicator color={colors.lime[500]} size="small" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.lime[500]}
                />
                <Text className="typo-btn-cta text-lime-500">
                  סיום ושמירה
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

export default BodyActivityStep;
