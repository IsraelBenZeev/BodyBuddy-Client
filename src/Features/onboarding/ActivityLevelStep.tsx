import { colors } from '@/colors';
import {
  ActivityLevel,
  activityLevelOptions,
  DEFAULT_PROTEIN_PER_KG,
  ProfileFormData,
} from '@/src/types/profile';
import ActionButton from '@/src/ui/ActionButton';
import LTRSlider from '@/src/ui/LTRSlider';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

const activityIcons: Record<ActivityLevel, string> = {
  sedentary: 'bed-outline',
  lightly_active: 'walk-outline',
  moderately_active: 'bicycle-outline',
  very_active: 'barbell-outline',
  extra_active: 'flame-outline',
};

interface ActivityLevelStepProps {
  control: Control<ProfileFormData>;
  trigger: UseFormTrigger<ProfileFormData>;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
}

const ActivityLevelStep = ({
  control,
  trigger,
  onBack,
  onNext,
  onSubmit,
  isPending = false,
}: ActivityLevelStepProps) => {
  const handleNext = useCallback(async () => {
    const isValid = await trigger(['activity_level', 'protein_per_kg']);
    if (isValid) onNext();
  }, [trigger, onNext]);

  const handleFinishAndSave = useCallback(async () => {
    if (!onSubmit) return;
    const isValid = await trigger(['activity_level', 'protein_per_kg']);
    if (isValid) onSubmit();
  }, [trigger, onSubmit]);

  return (
    <Animated.View entering={FadeInLeft.duration(400)} className="flex-1 px-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="typo-h1 text-white  mb-2">
          רמת הפעילות שלך
        </Text>
        <Text className="typo-h4 text-background-400 ">
          בחר/י את רמת הפעילות הגופנית הממוצעת שלך
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Activity Level */}
        <View className="mb-6 ">
          <Controller
            control={control}
            name="activity_level"
            rules={{ validate: (v) => v !== '' || 'יש לבחור רמת פעילות' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <View className="gap-3">
                  {activityLevelOptions.map((option) => {
                    const isSelected = value === option.value;
                    const iconName = activityIcons[option.value];
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        className={`flex-row items-center rounded-2xl p-4 border-2 gap-3 ${
                          isSelected
                            ? 'border-lime-500 bg-background-700'
                            : 'border-background-600 bg-background-800'
                        }`}
                        accessibilityRole="button"
                        accessibilityLabel={option.label}
                        accessibilityState={{ selected: isSelected }}
                      >
                        <View
                          className={`w-12 h-12 rounded-xl items-center justify-center ml-4  ${
                            isSelected ? 'bg-lime-500/20' : 'bg-background-700'
                          }`}
                        >
                          <Ionicons
                            name={iconName as keyof typeof Ionicons.glyphMap}
                            size={24}
                            color={isSelected ? colors.lime[500] : colors.background[400]}
                          />
                        </View>
                        <View className="flex-1 items-start">
                          <Text
                            className={`typo-body-primary ${
                              isSelected ? 'text-lime-500' : 'text-background-200'
                            }`}
                          >
                            {option.label}
                          </Text>
                          <Text className="typo-caption text-background-400 mt-1">
                            {option.description}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
                {error && (
                  <Text className="typo-caption text-red-400  mt-2">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Protein per kg */}
        <View className="mb-4">
          <Text className="typo-label text-background-200  mb-1">
            חלבון לכל ק״ג משקל (גרם)
          </Text>
          <Text className="typo-caption text-background-500  mb-3">
            ערך ברירת מחדל {DEFAULT_PROTEIN_PER_KG} – משמש לחישוב יעד החלבון היומי
          </Text>
          <Controller
            control={control}
            name="protein_per_kg"
            rules={{ validate: (v) => (v >= 0.8 && v <= 3) || 'ערך בין 0.8 ל-3' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <View className="bg-background-800 border border-background-600 rounded-2xl p-5">
                  <View className="items-center mb-2">
                    <Text className="typo-h2 text-white">{value.toFixed(1)}</Text>
                    <Text className="typo-caption text-background-400">גרם/ק״ג</Text>
                  </View>
                  <LTRSlider
                    value={value}
                    onValueChange={(val) => onChange((val as number[])[0])}
                    minimumValue={0.8}
                    maximumValue={3}
                    step={0.1}
                    minimumTrackTintColor={colors.lime[500]}
                    maximumTrackTintColor={colors.background[600]}
                    thumbTintColor={colors.lime[500]}
                    trackStyle={{ height: 6, borderRadius: 3 }}
                    thumbStyle={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                    }}
                  />
                  <View className="flex-row justify-between mt-1">
                    <Text className="typo-caption text-background-500">0.8</Text>
                    <Text className="typo-caption text-background-500">3</Text>
                  </View>
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
      </ScrollView>

      {/* כפתורי פעולה */}
      <View className="pt-1 gap-2">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ActionButton
              onPress={onBack}
              label="חזרה"
              iconName="arrow-forward"
              variant="secondary"
              size="sm"
              fullWidth
              disabled={isPending}
            />
          </View>
          <View className="flex-1">
            <ActionButton
              onPress={handleNext}
              label="הבא"
              iconName="arrow-back"
              variant="outline"
              size="sm"
              fullWidth
              disabled={isPending}
            />
          </View>
        </View>
        {onSubmit && (
          <ActionButton
            onPress={handleFinishAndSave}
            label="סיום ושמירה"
            iconName="checkmark-circle"
            variant="primary"
            size="sm"
            fullWidth
            disabled={isPending}
            loading={isPending}
          />
        )}
      </View>
    </Animated.View>
  );
};

export default ActivityLevelStep;
