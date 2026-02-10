import { colors } from '@/colors';
import {
  genderOptions,
  ProfileFormData,
} from '@/src/types/profile';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import AgeScrollPicker from './AgeScrollPicker';

const AGE_MIN = 10;
const AGE_MAX = 120;

interface PersonalInfoStepProps {
  control: Control<ProfileFormData>;
  trigger: UseFormTrigger<ProfileFormData>;
  onNext: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
}

const PersonalInfoStep = ({
  control,
  trigger,
  onNext,
  onSubmit,
  isPending = false,
}: PersonalInfoStepProps) => {
  const handleNext = useCallback(async () => {
    const isValid = await trigger(['full_name', 'gender', 'age']);
    if (isValid) onNext();
  }, [trigger, onNext]);

  const handleFinishAndSave = useCallback(async () => {
    if (!onSubmit) return;
    const isValid = await trigger(['full_name', 'gender', 'age']);
    if (isValid) onSubmit();
  }, [trigger, onSubmit]);

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1 px-6">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-white text-3xl font-black text-right mb-2">
          ספר/י לנו על עצמך
        </Text>
        <Text className="text-background-400 text-base text-right">
          כדי שנתאים לך את חוויית האימון המושלמת
        </Text>
      </View>

      {/* Full Name */}
      <View className="mb-6">
        <Text className="text-background-200 text-sm font-semibold text-right mb-2">
          שם מלא
        </Text>
        <Controller
          control={control}
          name="full_name"
          rules={{
            required: 'שדה חובה',
            minLength: { value: 2, message: 'לפחות 2 תווים' },
          }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View>
              <TextInput
                className="bg-background-800 border border-background-600 rounded-2xl px-4 py-4 text-white text-base text-right"
                placeholder="השם שלך"
                placeholderTextColor={colors.background[500]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
              />
              {error && (
                <Text className="text-red-400 text-xs text-right mt-1">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Gender */}
      <View className="mb-6">
        <Text className="text-background-200 text-sm font-semibold text-right mb-2">
          מין
        </Text>
        <Controller
          control={control}
          name="gender"
          rules={{ validate: (v) => v !== '' || 'יש לבחור מין' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <View className="flex-row-reverse gap-3">
                {genderOptions.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => onChange(option.value)}
                      className={`flex-1 rounded-2xl p-4 items-center justify-center border-2 ${
                        isSelected
                          ? 'border-lime-500 bg-background-700'
                          : 'border-background-600 bg-background-800'
                      }`}
                    >
                      <Ionicons
                        name={option.icon as 'male' | 'female'}
                        size={32}
                        color={isSelected ? colors.lime[500] : colors.background[400]}
                      />
                      <Text
                        className={`text-base font-bold mt-2 ${
                          isSelected ? 'text-lime-500' : 'text-background-300'
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
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

      {/* Age - Horizontal Scroll Picker */}
      <View className="mb-4">
        <Text className="text-background-200 text-sm font-semibold text-right mb-2">
          גיל
        </Text>
        <Controller
          control={control}
          name="age"
          rules={{
            validate: (v) => (v >= AGE_MIN && v <= AGE_MAX) || 'גיל לא תקין',
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <View className="bg-background-800 border border-background-600 rounded-2xl overflow-hidden py-3">
                <AgeScrollPicker
                  min={AGE_MIN}
                  max={AGE_MAX}
                  value={value}
                  onChange={onChange}
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

      {/* כפתורי פעולה */}
      <View className="mt-auto gap-3">
        <Pressable
          onPress={handleNext}
          disabled={isPending}
          className="flex-row-reverse items-center justify-center gap-2 bg-lime-500 w-full py-4 rounded-2xl shadow-lg disabled:opacity-70 active:opacity-90"
        >
          <Ionicons name="arrow-back" size={22} color={colors.background[900]} />
          <Text className="text-black font-extrabold text-base">הבא</Text>
        </Pressable>

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

export default PersonalInfoStep;
