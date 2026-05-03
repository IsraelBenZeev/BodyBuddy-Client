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
import BirthDatePicker from './BirthDatePicker';

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
    const isValid = await trigger(['full_name', 'gender', 'date_of_birth']);
    if (isValid) onNext();
  }, [trigger, onNext]);

  const handleFinishAndSave = useCallback(async () => {
    if (!onSubmit) return;
    const isValid = await trigger(['full_name', 'gender', 'date_of_birth']);
    if (isValid) onSubmit();
  }, [trigger, onSubmit]);

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1 px-6 ">
      <View>
      {/* Header */}
      <View className="mb-4 items-start ">
        <Text className="typo-h1 text-white mb-2">
          ספר/י לנו על עצמך
        </Text>
        <Text className="typo-h3 text-background-400 ">
          כדי שנתאים לך את חוויית האימון המושלמת
        </Text>
      </View>

      {/* Full Name */}
      <View className="mb-4">
        <Text className="typo-label text-background-200  mb-1">
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
                className="typo-input bg-background-800 border border-background-600 rounded-2xl px-4 py-4 text-white "
                placeholder="השם שלך"
                placeholderTextColor={colors.background[500]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
              />
              {error && (
                <Text className="typo-caption text-red-400  mt-1">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Gender */}
      <View className="mb-4">
        <Text className="typo-label text-background-200  mb-1">
          מין
        </Text>
        <Controller
          control={control}
          name="gender"
          rules={{ validate: (v) => v !== '' || 'יש לבחור מין' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <View className="flex-row gap-3">
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
                      accessibilityRole="button"
                      accessibilityLabel={option.label}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Ionicons
                        name={option.icon as 'male' | 'female'}
                        size={32}
                        color={isSelected ? colors.lime[500] : colors.background[400]}
                      />
                      <Text
                        className={`typo-body-primary mt-2 ${
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
                <Text className="typo-caption text-red-400  mt-1">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* תאריך לידה */}
      <View className="mb-4">
        <Text className="typo-label text-background-200  mb-1">
          תאריך לידה
        </Text>
        <Controller
          control={control}
          name="date_of_birth"
          rules={{ required: 'חובה לבחור תאריך לידה' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

            return (
              <View>
                <View className="bg-background-800 border border-background-600 rounded-2xl overflow-hidden py-2 px-2">
                  <BirthDatePicker value={value} onChange={onChange} />
                </View>
                <Text className="typo-body-primary text-background-400  mt-1">
                  גיל: {age}
                </Text>
                <Text className="typo-caption text-background-500  mt-1">
                  * BodyBuddy מיועד לגילאי 18 ומעלה בלבד
                </Text>
                {error && (
                  <Text className="typo-caption text-red-400  mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            );
          }}
        />
      </View>

      </View>

      {/* כפתורי פעולה */}
      <View className="pt-1 pb-3 gap-2">
        <Pressable
          onPress={handleNext}
          disabled={isPending}
          className="flex-row items-center justify-center gap-2 bg-lime-500 w-full py-3 rounded-2xl shadow-lg disabled:opacity-70 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="הבא"
        >
          <Ionicons name="arrow-back" size={20} color={colors.background[900]} />
          <Text className="typo-btn-cta text-black">הבא</Text>
        </Pressable>

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

export default PersonalInfoStep;
