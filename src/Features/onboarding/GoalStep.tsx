import { colors } from '@/colors';
import {
  DEFAULT_CALORIE_OFFSET,
  getOffsetIntensity,
  Goal,
  goalOptions,
  ProfileFormData,
} from '@/src/types/profile';
import { calculateDailyCalories } from '@/src/utils/calculateMetrics';
import { Ionicons } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';
import { useCallback, useMemo, useRef } from 'react';
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormTrigger,
  useWatch,
} from 'react-hook-form';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInLeft } from 'react-native-reanimated';

/** תיאור כיוון ההפרש בעברית */
const OFFSET_LABEL: Record<Goal, string> = {
  cut: 'גרעון קלורי',
  bulk: 'עודף קלורי',
  maintain: '',
};

interface GoalStepProps {
  control: Control<ProfileFormData>;
  trigger: UseFormTrigger<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

const GoalStep = ({
  control,
  trigger,
  setValue,
  onBack,
  onSubmit,
  isPending,
}: GoalStepProps) => {
  const handleSubmit = useCallback(async () => {
    const isValid = await trigger(['goal', 'calorie_offset']);
    if (isValid) onSubmit();
  }, [trigger, onSubmit]);

  // קריאת כל הנתונים שהיוזר כבר מילא בשלבים הקודמים + המטרה הנוכחית
  const formValues = useWatch({ control });

  // שומר את המטרה הקודמת כדי לזהות שינוי ולהגדיר ברירת מחדל מתאימה
  const prevGoalRef = useRef<string>(formValues.goal ?? '');

  const showOffsetPicker =
    formValues.goal === 'cut' || formValues.goal === 'bulk';

  // כשהמטרה משתנה – מגדיר ברירת מחדל מתאימה ל-calorie_offset
  const currentGoal = formValues.goal;
  if (
    currentGoal !== prevGoalRef.current &&
    (currentGoal === 'cut' || currentGoal === 'bulk')
  ) {
    // רק אם עברנו ממטרה אחרת (לא אותה מטרה)
    if (
      prevGoalRef.current !== 'cut' &&
      prevGoalRef.current !== 'bulk'
    ) {
      setValue('calorie_offset', DEFAULT_CALORIE_OFFSET[currentGoal]);
    }
    prevGoalRef.current = currentGoal ?? '';
  } else if (currentGoal !== prevGoalRef.current) {
    prevGoalRef.current = currentGoal ?? '';
  }

  const offsetIntensity = useMemo(() => {
    if (!formValues.goal || formValues.goal === 'maintain') {
      return null;
    }
    return getOffsetIntensity(
      formValues.calorie_offset ?? 500,
      formValues.goal as Goal,
    );
  }, [formValues.goal, formValues.calorie_offset]);

  const dailyCalories = useMemo(() => {
    if (!formValues.goal) return null;
    return calculateDailyCalories(
      formValues.gender || null,
      formValues.weight ?? null,
      formValues.height ?? null,
      formValues.age ?? null,
      formValues.activity_level || null,
      formValues.goal,
      formValues.calorie_offset ?? null,
    );
  }, [
    formValues.gender,
    formValues.weight,
    formValues.height,
    formValues.age,
    formValues.activity_level,
    formValues.goal,
    formValues.calorie_offset,
  ]);

  return (
    <Animated.View
      entering={FadeInLeft.duration(400)}
      className="flex-1 px-6"
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-white text-3xl font-black text-right mb-2">
          מה המטרה שלך?
        </Text>
        <Text className="text-background-400 text-base text-right">
          בחר/י את המטרה העיקרית שלך ונתאים לך תוכנית תזונה
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Goal Cards */}
        <Controller
          control={control}
          name="goal"
          rules={{ validate: (v) => v !== '' || 'יש לבחור מטרה' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <View className="gap-4">
                {goalOptions.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => onChange(option.value)}
                      className={`flex-row-reverse items-center rounded-2xl p-5 border-2 ${
                        isSelected
                          ? 'border-lime-500 bg-background-700'
                          : 'border-background-600 bg-background-800'
                      }`}
                    >
                      <View
                        className={`w-14 h-14 rounded-2xl items-center justify-center ml-4 ${
                          isSelected ? 'bg-lime-500/20' : 'bg-background-700'
                        }`}
                      >
                        <Ionicons
                          name={
                            option.icon as keyof typeof Ionicons.glyphMap
                          }
                          size={28}
                          color={
                            isSelected
                              ? colors.lime[500]
                              : colors.background[400]
                          }
                        />
                      </View>
                      <View className="flex-1 items-end">
                        <Text
                          className={`text-lg font-bold ${
                            isSelected
                              ? 'text-lime-500'
                              : 'text-background-200'
                          }`}
                        >
                          {option.label}
                        </Text>
                        <Text className="text-background-400 text-sm mt-1 text-right">
                          {option.description}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {error && (
                <Text className="text-red-400 text-xs text-right mt-3">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* בוחר הפרש קלוריות – מופיע רק ב-cut או bulk */}
        {showOffsetPicker && (
          <Animated.View entering={FadeIn.duration(400)} className="mt-6">
            <Text className="text-background-200 text-sm font-semibold text-right mb-1">
              {OFFSET_LABEL[formValues.goal as Goal]}
            </Text>

            <Controller
              control={control}
              name="calorie_offset"
              rules={{
                validate: (v) =>
                  (v >= 100 && v <= 1000) ||
                  'יש לבחור הפרש בין 100 ל-1000 קלוריות',
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View className="bg-background-800 border border-background-600 rounded-2xl p-5">
                  {/* מספר גדול מרכזי */}
                  <View className="items-center mb-2">
                    <Text
                      className="text-3xl font-black"
                      style={{ color: offsetIntensity?.color ?? colors.lime[500] }}
                    >
                      {value}
                    </Text>
                    <Text className="text-background-400 text-xs">קק״ל</Text>
                  </View>

                  {/* Slider */}
                  <Slider
                    value={value}
                    onValueChange={(val) => onChange(Math.round((val as number[])[0]))}
                    minimumValue={100}
                    maximumValue={1000}
                    step={50}
                    minimumTrackTintColor={offsetIntensity?.color ?? colors.lime[500]}
                    maximumTrackTintColor={colors.background[600]}
                    thumbTintColor={offsetIntensity?.color ?? colors.lime[500]}
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

                  {/* טווח מינימום-מקסימום */}
                  <View className="flex-row justify-between mt-1 mb-3">
                    <Text className="text-background-500 text-xs">100</Text>
                    <Text className="text-background-500 text-xs">1000</Text>
                  </View>

                  {/* משוב ויזואלי */}
                  {offsetIntensity && (
                    <Text
                      className="text-sm font-bold text-center"
                      style={{ color: offsetIntensity.color }}
                    >
                      {offsetIntensity.label}
                    </Text>
                  )}

                  {error && (
                    <Text className="text-red-400 text-xs text-right mt-2">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </Animated.View>
        )}

        {/* תוצאת הקלוריות – מופיעה רק לאחר בחירת מטרה */}
        {dailyCalories != null && (
          <Animated.View
            entering={FadeIn.duration(500)}
            className="mt-6 bg-background-800 rounded-2xl p-5 border border-lime-500/30"
          >
            <View className="flex-row-reverse items-center mb-3">
              <Ionicons
                name="nutrition-outline"
                size={22}
                color={colors.lime[500]}
              />
              <Text className="text-lime-500 text-sm font-bold mr-2">
                התוכנית שלך מוכנה!
              </Text>
            </View>

            <Text className="text-background-300 text-sm text-right mb-3">
              על בסיס הנתונים שהזנת, אלו הקלוריות היומיות המומלצות עבורך:
            </Text>

            <View className="bg-background-700 rounded-xl p-5 border border-background-600 items-center">
              <Text className="text-background-400 text-xs mb-2">
                קלוריות יומיות מומלצות
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-background-400 text-sm ml-1">
                  קק״ל
                </Text>
                <Text className="text-lime-400 text-4xl font-black">
                  {dailyCalories.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* הצגת כמות ההפרש עם תיוג עוצמה */}
            {showOffsetPicker && offsetIntensity && (
              <Text className="text-background-400 text-xs text-center mt-3">
                {formValues.goal === 'cut' ? 'גרעון' : 'עודף'} של{' '}
                <Text className="font-bold" style={{ color: offsetIntensity.color }}>
                  {formValues.calorie_offset}
                </Text>{' '}
                קק״ל ·{' '}
                <Text className="font-bold" style={{ color: offsetIntensity.color }}>
                  {offsetIntensity.tag}
                </Text>
              </Text>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* כפתורי פעולה – חזרה, סיום ושמירה */}
      <View className="flex-row-reverse gap-3 pt-2 pb-4">
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
          onPress={handleSubmit}
          disabled={isPending}
          className={`flex-row-reverse items-center justify-center gap-2 flex-1 rounded-2xl py-4 shadow-lg ${
            isPending ? 'bg-lime-700' : 'bg-lime-500'
          } disabled:opacity-70 active:opacity-90`}
        >
          {isPending ? (
            <ActivityIndicator color={colors.background[900]} size="small" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.background[900]}
              />
              <Text className="text-black font-extrabold text-base">
                סיום ושמירה
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default GoalStep;
