import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import {
  ActivityLevel,
  activityLevelOptions,
  ProfileFormData,
} from '@/src/types/profile';

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
  onSubmit: () => void;
  isPending: boolean;
}

const BodyActivityStep = ({
  control,
  trigger,
  onBack,
  onSubmit,
  isPending,
}: BodyActivityStepProps) => {
  const handleSubmit = useCallback(async () => {
    const isValid = await trigger(['weight', 'activity_level']);
    if (isValid) onSubmit();
  }, [trigger, onSubmit]);

  return (
    <Animated.View entering={FadeInLeft.duration(400)} className="flex-1 px-6">
      {/* Header */}
      <View className="mb-8">
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
        {/* Weight */}
        <View className="mb-6">
          <Text className="text-background-200 text-sm font-semibold text-right mb-2">
            משקל (ק״ג)
          </Text>
          <Controller
            control={control}
            name="weight"
            rules={{
              required: 'שדה חובה',
              validate: (val) => {
                const num = Number(val);
                if (isNaN(num)) return 'יש להזין מספר';
                if (num < 20 || num > 300)
                  return 'משקל חייב להיות בין 20 ל-300 ק״ג';
                return true;
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View>
                <TextInput
                  className="bg-background-800 border border-background-600 rounded-2xl px-4 py-4 text-white text-base text-right"
                  placeholder="המשקל שלך בק״ג"
                  placeholderTextColor={colors.background[500]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  maxLength={5}
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

        {/* Activity Level */}
        <View className="mb-6">
          <Text className="text-background-200 text-sm font-semibold text-right mb-3">
            רמת פעילות
          </Text>
          <Controller
            control={control}
            name="activity_level"
            rules={{ required: 'יש לבחור רמת פעילות' }}
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
                          className={`w-12 h-12 rounded-xl items-center justify-center mr-0 ml-4 ${
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
          disabled={isPending}
          className="flex-row-reverse items-center justify-center bg-background-800 border border-background-600 rounded-2xl px-6 py-4"
        >
          <Ionicons name="arrow-forward" size={18} color={colors.background[200]} />
          <Text className="text-background-200 font-bold text-sm mr-1">חזרה</Text>
        </Pressable>

        <Pressable
          onPress={handleSubmit}
          disabled={isPending}
          className={`flex-1 rounded-2xl py-4 items-center shadow-lg ${
            isPending ? 'bg-lime-700' : 'bg-lime-500'
          }`}
        >
          {isPending ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-center text-black font-extrabold text-base">
              סיום
            </Text>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default BodyActivityStep;
