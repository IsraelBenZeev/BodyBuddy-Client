import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import {
  Gender,
  genderOptions,
  ProfileFormData,
} from '@/src/types/profile';

interface PersonalInfoStepProps {
  control: Control<ProfileFormData>;
  trigger: UseFormTrigger<ProfileFormData>;
  onNext: () => void;
}

const PersonalInfoStep = ({ control, trigger, onNext }: PersonalInfoStepProps) => {
  const handleNext = useCallback(async () => {
    const isValid = await trigger(['full_name', 'gender', 'age']);
    if (isValid) onNext();
  }, [trigger, onNext]);

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
      <View className="mb-5">
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
      <View className="mb-5">
        <Text className="text-background-200 text-sm font-semibold text-right mb-2">
          מין
        </Text>
        <Controller
          control={control}
          name="gender"
          rules={{ required: 'יש לבחור מין' }}
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

      {/* Age */}
      <View className="mb-5">
        <Text className="text-background-200 text-sm font-semibold text-right mb-2">
          גיל
        </Text>
        <Controller
          control={control}
          name="age"
          rules={{
            required: 'שדה חובה',
            validate: (val) => {
              const num = Number(val);
              if (isNaN(num)) return 'יש להזין מספר';
              if (num < 10 || num > 120) return 'גיל חייב להיות בין 10 ל-120';
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View>
              <TextInput
                className="bg-background-800 border border-background-600 rounded-2xl px-4 py-4 text-white text-base text-right"
                placeholder="הגיל שלך"
                placeholderTextColor={colors.background[500]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={3}
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

      {/* Next Button */}
      <Pressable
        onPress={handleNext}
        className="bg-lime-500 w-full py-4 rounded-2xl items-center shadow-lg mt-auto"
      >
        <Text className="text-center text-black font-extrabold text-base">הבא</Text>
      </Pressable>
    </Animated.View>
  );
};

export default PersonalInfoStep;
