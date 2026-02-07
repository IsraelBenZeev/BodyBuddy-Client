import { colors } from '@/colors';
import {
  ActivityLevel,
  activityLevelOptions,
  ProfileFormData,
} from '@/src/types/profile';
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
import HorizontalRuler from './HorizontalRuler';

/** אייקון לכל רמת פעילות */
const activityIcons: Record<ActivityLevel, string> = {
  sedentary: 'bed-outline',
  lightly_active: 'walk-outline',
  moderately_active: 'bicycle-outline',
  very_active: 'barbell-outline',
  extra_active: 'flame-outline',
};

interface BodyActivityStepProps {
  control: Control<ProfileFormData>;
  trigger: UseFormTrigger<ProfileFormData>;
  onBack: () => void;
  onNext: () => void;
}

const BodyActivityStep = ({
  control,
  trigger,
  onBack,
  onNext,
}: BodyActivityStepProps) => {
  const handleNext = useCallback(async () => {
    const isValid = await trigger(['height', 'weight', 'activity_level']);
    if (isValid) onNext();
  }, [trigger, onNext]);

  return (
    <Animated.View entering={FadeInLeft.duration(400)} className="flex-1 px-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-white text-3xl font-black text-right mb-2">
          עוד קצת פרטים
        </Text>
        <Text className="text-background-400 text-base text-right">
          המידע הזה יעזור לנו לבנות לך תוכנית מותאמת אישית
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Height - Horizontal Ruler */}
        <View className="mb-6">
          <Text className="text-background-200 text-sm font-semibold text-right mb-3">
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
                  <Text className="text-red-400 text-xs text-right mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Weight - Horizontal Ruler */}
        <View className="mb-6">
          <Text className="text-background-200 text-sm font-semibold text-right mb-3">
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
                  <Text className="text-red-400 text-xs text-right mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Activity Level */}
        <View className="mb-4">
          <Text className="text-background-200 text-sm font-semibold text-right mb-3">
            רמת פעילות
          </Text>
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
                        className={`flex-row-reverse items-center rounded-2xl p-4 border-2 ${
                          isSelected
                            ? 'border-lime-500 bg-background-700'
                            : 'border-background-600 bg-background-800'
                        }`}
                      >
                        <View
                          className={`w-12 h-12 rounded-xl items-center justify-center ml-4 ${
                            isSelected ? 'bg-lime-500/20' : 'bg-background-700'
                          }`}
                        >
                          <Ionicons
                            name={iconName as keyof typeof Ionicons.glyphMap}
                            size={24}
                            color={
                              isSelected
                                ? colors.lime[500]
                                : colors.background[400]
                            }
                          />
                        </View>
                        <View className="flex-1 items-end">
                          <Text
                            className={`text-base font-bold ${
                              isSelected
                                ? 'text-lime-500'
                                : 'text-background-200'
                            }`}
                          >
                            {option.label}
                          </Text>
                          <Text className="text-background-400 text-xs mt-1">
                            {option.description}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
                {error && (
                  <Text className="text-red-400 text-xs text-right mt-2">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row-reverse gap-3 pt-2 pb-4">
        <Pressable
          onPress={onBack}
          className="flex-row-reverse items-center justify-center bg-background-800 border border-background-600 rounded-2xl px-6 py-4"
        >
          <Ionicons name="arrow-forward" size={18} color={colors.background[200]} />
          <Text className="text-background-200 font-bold text-sm mr-1">חזרה</Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          className="flex-1 rounded-2xl py-4 items-center shadow-lg bg-lime-500"
        >
          <Text className="text-center text-black font-extrabold text-base">
            הבא
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default BodyActivityStep;
