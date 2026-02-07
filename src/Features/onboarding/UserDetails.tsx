import { useAuthStore } from '@/src/store/useAuthStore';
import { useCreateOrUpdateProfile, useProfile } from '@/src/hooks/useProfile';
import BackGround from '@/src/ui/BackGround';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import {
  ActivityLevel,
  CreateProfilePayload,
  Gender,
  Goal,
  ProfileFormData,
} from '@/src/types/profile';
import BodyActivityStep from './BodyActivityStep';
import GoalStep from './GoalStep';
import PersonalInfoStep from './PersonalInfoStep';
import StepDots from './StepDots';

const TOTAL_STEPS = 3;

const UserDetails = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [currentStep, setCurrentStep] = useState(0);

  // שליפת פרופיל קיים – אם יש נתונים, נמלא איתם את הטופס
  const { data: existingProfile, isLoading: isProfileLoading } = useProfile(user?.id);

  // ערכי ברירת מחדל – עבור משתמש חדש שעדיין אין לו פרופיל
  const defaultValues = useMemo<ProfileFormData>(
    () => ({
      full_name: user?.user_metadata?.full_name ?? '',
      age: 25,
      height: 170,
      weight: 70,
      gender: '' as Gender | '',
      activity_level: '' as ActivityLevel | '',
      goal: '' as Goal | '',
      calorie_offset: 500,
    }),
    [user?.user_metadata?.full_name],
  );

  const { control, trigger, handleSubmit, reset, setValue } = useForm<ProfileFormData>({
    defaultValues,
    mode: 'onTouched',
  });

  // כשמגיע פרופיל קיים מ-Supabase – מעדכנים את הטופס עם הנתונים
  useEffect(() => {
    if (existingProfile) {
      reset({
        full_name: existingProfile.full_name ?? user?.user_metadata?.full_name ?? '',
        age: existingProfile.age ?? 25,
        height: existingProfile.height ?? 170,
        weight: existingProfile.weight ?? 70,
        gender: (existingProfile.gender as Gender) ?? '',
        activity_level: (existingProfile.activity_level as ActivityLevel) ?? '',
        goal: existingProfile.goal ?? '',
        calorie_offset: existingProfile.calorie_offset ?? 500,
      });
    }
  }, [existingProfile, reset, user?.user_metadata?.full_name]);

  const { mutate, isPending } = useCreateOrUpdateProfile(user?.id ?? '');

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const onFormSubmit = useCallback(
    (data: ProfileFormData) => {
      const payload: CreateProfilePayload = {
        full_name: data.full_name.trim(),
        age: data.age,
        height: data.height,
        weight: data.weight,
        gender: data.gender as Gender,
        activity_level: data.activity_level as ActivityLevel,
        goal: data.goal as Goal,
        calorie_offset: data.calorie_offset,
        avatar_url: user?.user_metadata?.avatar_url ?? undefined,
      };

      mutate(payload, {
        onSuccess: () => {
          router.replace('/(tabs)');
        },
      });
    },
    [mutate, user?.user_metadata?.avatar_url, router],
  );

  const handleFinish = useCallback(() => {
    handleSubmit(onFormSubmit)();
  }, [handleSubmit, onFormSubmit]);

  // Loading state – מחכים שהפרופיל ייטען לפני הצגת הטופס
  if (isProfileLoading) {
    return (
      <BackGround>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="rgb(150, 200, 40)" size="large" />
        </View>
      </BackGround>
    );
  }

  return (
    <BackGround>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Progress Dots */}
        <StepDots totalSteps={TOTAL_STEPS} currentStep={currentStep} />

        {/* Step Content */}
        {currentStep === 0 && (
          <PersonalInfoStep
            control={control}
            trigger={trigger}
            onNext={handleNext}
          />
        )}

        {currentStep === 1 && (
          <BodyActivityStep
            control={control}
            trigger={trigger}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <GoalStep
            control={control}
            trigger={trigger}
            setValue={setValue}
            onBack={handleBack}
            onSubmit={handleFinish}
            isPending={isPending}
          />
        )}
      </KeyboardAvoidingView>
    </BackGround>
  );
};

export default UserDetails;
