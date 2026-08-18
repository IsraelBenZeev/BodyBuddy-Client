import { ProfileFormData } from '@/src/types/profile';
import IconCaptionButton from '@/src/ui/IconCaptionButton';
import { useCallback } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import { Text, View } from 'react-native';
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
        <Text className="typo-h1 text-white  mb-2">
          המדדים שלך
        </Text>
        <Text className="typo-h4 text-background-400 ">
          גובה ומשקל לחישוב מדויק של תוכניתך
        </Text>
      </View>

      <View>
        {/* Height - Horizontal Ruler */}
        <View className="mb-6">
          <Text className="typo-label text-background-200  mb-3">
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
                    label="גובה"
                  />
                </View>
                {error && (
                  <Text className="typo-caption text-red-400  mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Weight - Horizontal Ruler */}
        <View className="mb-6">
          <Text className="typo-label text-background-200  mb-3">
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
                    label="משקל"
                  />
                </View>
                {error && (
                  <Text className="typo-caption text-red-400  mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

      </View>

      {/* כפתורי פעולה – חזרה, סיום ושמירה, הבא */}
      <View className="mt-auto pt-1 flex-row justify-between items-start">
        <IconCaptionButton
          onPress={onBack}
          iconName="chevron-forward-circle-outline"
          caption="הקודם"
          variant="secondary"
          disabled={isPending}
          accessibilityLabel="חזרה"
          accessibilityHint="חוזר לשלב הקודם"
        />
        {onSubmit && (
          <IconCaptionButton
            onPress={handleFinishAndSave}
            iconName="checkmark-circle-outline"
            caption="שמירה"
            variant="primary"
            disabled={isPending}
            loading={isPending}
            accessibilityLabel="סיום ושמירה"
            accessibilityHint="שומר את הפרופיל ומסיים את תהליך ההרשמה"
          />
        )}
        <IconCaptionButton
          onPress={handleNext}
          iconName="chevron-back-circle-outline"
          caption="הבא"
          variant="outline"
          disabled={isPending}
          accessibilityLabel="הבא"
          accessibilityHint="עובר לשלב הבא בתהליך ההרשמה"
        />
      </View>
    </Animated.View>
  );
};

export default BodyActivityStep;
