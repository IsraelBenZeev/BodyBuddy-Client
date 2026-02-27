import { colors } from '@/colors';
import {
  ActivityLevel,
  activityLevelOptions,
  DEFAULT_PROTEIN_PER_KG,
  ProfileFormData,
} from '@/src/types/profile';
import { Ionicons } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';
import { useCallback } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import {
  ActivityIndicator,
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
    const isValid = await trigger(['height', 'weight', 'protein_per_kg', 'activity_level']);
    if (isValid) onNext();
  }, [trigger, onNext]);

  const handleFinishAndSave = useCallback(async () => {
    if (!onSubmit) return;
    const isValid = await trigger(['height', 'weight', 'protein_per_kg', 'activity_level']);
    if (isValid) onSubmit();
  }, [trigger, onSubmit]);

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

        {/* Protein per kg */}
        <View className="mb-6">
          <Text className="text-background-200 text-sm font-semibold text-right mb-1">
            חלבון לכל ק״ג משקל (גרם)
          </Text>
          <Text className="text-background-500 text-xs text-right mb-3">
            ערך ברירת מחדל {DEFAULT_PROTEIN_PER_KG} – משמש לחישוב יעד החלבון היומי
          </Text>
          <Controller
            control={control}
            name="protein_per_kg"
            rules={{
              validate: (v) =>
                (v >= 0.8 && v <= 3) || 'ערך בין 0.8 ל-3',
            }}
            render={({
              field: { onChange, value },
              fieldState: { error },
            }) => (
              <View>
                <View className="bg-background-800 border border-background-600 rounded-2xl p-5">
                  <View className="items-center mb-2">
                    <Text className="text-white text-2xl font-black">{value.toFixed(1)}</Text>
                    <Text className="text-background-400 text-xs">גרם/ק״ג</Text>
                  </View>
                  <Slider
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
                    <Text className="text-background-500 text-xs">0.8</Text>
                    <Text className="text-background-500 text-xs">3</Text>
                  </View>
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

      {/* כפתורי פעולה – חזרה, הבא, סיום ושמירה */}
      <View className="pt-2 pb-4 gap-3">
        <View className="flex-row-reverse gap-3">
          <Pressable
            onPress={onBack}
            disabled={isPending}
            className="flex-row-reverse items-center justify-center gap-2 flex-1 rounded-2xl py-4 bg-background-800 border border-background-600 disabled:opacity-70 active:opacity-90"
          >
            <Ionicons
              name="arrow-forward"
              size={22}
              color={colors.background[200]}
            />
            <Text className="text-background-200 font-bold text-base">חזרה</Text>
          </Pressable>

          <Pressable
            onPress={handleNext}
            disabled={isPending}
            className="flex-row-reverse items-center justify-center gap-2 flex-1 rounded-2xl py-4 shadow-lg bg-lime-500 disabled:opacity-70 active:opacity-90"
          >
            <Ionicons name="arrow-back" size={22} color={colors.background[900]} />
            <Text className="text-black font-extrabold text-base">הבא</Text>
          </Pressable>
        </View>

        {onSubmit && (
          <Pressable
            onPress={handleFinishAndSave}
            disabled={isPending}
            className="flex-row-reverse items-center justify-center gap-2 py-4 rounded-2xl border-2 border-lime-500 bg-lime-500/15 disabled:opacity-70 active:opacity-90"
          >
            {isPending ? (
              <ActivityIndicator color={colors.lime[500]} size="small" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.lime[500]}
                />
                <Text className="text-lime-500 font-bold text-base">
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
