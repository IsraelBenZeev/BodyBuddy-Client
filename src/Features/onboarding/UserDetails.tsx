import { useAuthStore } from '@/src/store/useAuthStore';
import { useCreateOrUpdateProfile } from '@/src/hooks/useProfile';
import BackGround from '@/src/ui/BackGround';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform } from 'react-native';
import {
  ActivityLevel,
  CreateProfilePayload,
  Gender,
  ProfileFormData,
} from '@/src/types/profile';
import BodyActivityStep from './BodyActivityStep';
import PersonalInfoStep from './PersonalInfoStep';
import StepDots from './StepDots';

const TOTAL_STEPS = 2;

const UserDetails = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [currentStep, setCurrentStep] = useState(0);

  // מילוי מוקדם של השם מהנתונים של גוגל
  const defaultValues = useMemo<ProfileFormData>(
    () => ({
      full_name: user?.user_metadata?.full_name ?? '',
      age: '',
      weight: '',
      gender: '' as Gender | '',
      activity_level: '' as ActivityLevel | '',
    }),
    [user?.user_metadata?.full_name],
  );

  const { control, trigger, handleSubmit } = useForm<ProfileFormData>({
    defaultValues,
    mode: 'onTouched',
  });

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
        age: Number(data.age),
        weight: Number(data.weight),
        gender: data.gender as Gender,
        activity_level: data.activity_level as ActivityLevel,
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
            onSubmit={handleFinish}
            isPending={isPending}
          />
        )}
      </KeyboardAvoidingView>
    </BackGround>
  );
};

export default UserDetails;
