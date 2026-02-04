import { useEffect, useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import BackGround from '@/src/ui/BackGround';
import FormInput from '@/src/ui/FormInput';
import ButtonPrimary from '@/src/ui/ButtonPrimary';
import { signUpWithEmail } from '@/src/service/authService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUIStore } from '@/src/store/useUIStore';
import { colors } from '@/colors';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const triggerSuccess = useUIStore((state) => state.triggerSuccess);
  const [shouldNavigateToTabs, setShouldNavigateToTabs] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (shouldNavigateToTabs) {
      router.replace('/(tabs)');
    }
  }, [shouldNavigateToTabs, router]);

  const password = watch('password');

  const onSubmit = async (formData: RegisterFormData) => {
    setLoading(true);
    const { data, error } = await signUpWithEmail(formData.email, formData.password);
    setLoading(false);

    if (error) {
      triggerSuccess('שגיאה בהרשמה - נסה שוב');
    } else {
      triggerSuccess('נרשמת בהצלחה!');
      if (data?.user) useAuthStore.getState().setUser(data.user);
      if (data?.session) useAuthStore.getState().setSession(data.session);
      setShouldNavigateToTabs(true); // ניווט אחרי הרשמה מוצלחת (בלוגין יש session תמיד; בהרשמה לפעמים רק אחרי אימות אימייל)
    }
  };

  return (
    <BackGround>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-5 py-12 justify-center">
            {/* Logo/Title */}
            <View className="mb-12">
              <Text className="text-lime-400 text-4xl font-black text-center mb-2">BodyBuddy</Text>
              <Text className="text-background-400 text-base text-center">צור חשבון חדש</Text>
            </View>

            {/* Email Input */}
            <FormInput
              control={control}
              name="email"
              rules={{
                required: 'אימייל חובה',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'אימייל לא תקין',
                },
              }}
              label="אימייל"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginBottom: 20 }}
              labelStyle={{
                color: colors.lime[400],
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
                textAlign: 'right',
              }}
              inputStyle={{
                backgroundColor: colors.background[800],
                borderWidth: 1,
                borderColor: errors.email ? colors.red[500] : colors.background[600],
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                color: colors.white,
                fontSize: 16,
                textAlign: 'right',
              }}
              errorStyle={{
                color: colors.red[400],
                fontSize: 14,
                textAlign: 'right',
                marginTop: 4,
              }}
            />

            {/* Password Input */}
            <FormInput
              control={control}
              name="password"
              rules={{
                required: 'סיסמה חובה',
                minLength: {
                  value: 6,
                  message: 'לפחות 6 תווים',
                },
              }}
              label="סיסמה"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginBottom: 20 }}
              labelStyle={{
                color: colors.lime[400],
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
                textAlign: 'right',
              }}
              inputStyle={{
                backgroundColor: colors.background[800],
                borderWidth: 1,
                borderColor: errors.password ? colors.red[500] : colors.background[600],
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                color: colors.white,
                fontSize: 16,
                textAlign: 'right',
              }}
              errorStyle={{
                color: colors.red[400],
                fontSize: 14,
                textAlign: 'right',
                marginTop: 4,
              }}
            />

            {/* Confirm Password Input */}
            <FormInput
              control={control}
              name="confirmPassword"
              rules={{
                required: 'אימות סיסמה חובה',
                validate: (value) => value === password || 'הסיסמאות לא תואמות',
              }}
              label="אימות סיסמה"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{ marginBottom: 24 }}
              labelStyle={{
                color: colors.lime[400],
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
                textAlign: 'right',
              }}
              inputStyle={{
                backgroundColor: colors.background[800],
                borderWidth: 1,
                borderColor: errors.confirmPassword ? colors.red[500] : colors.background[600],
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                color: colors.white,
                fontSize: 16,
                textAlign: 'right',
              }}
              errorStyle={{
                color: colors.red[400],
                fontSize: 14,
                textAlign: 'right',
                marginTop: 4,
              }}
            />

            {/* Register Button */}
            <ButtonPrimary
              title={loading ? 'נרשם...' : 'הירשם'}
              onPress={handleSubmit(onSubmit)}
              classNameButton="mb-4"
            />

            {/* Login Link */}
            <View className="mt-8">
              <Pressable
                onPress={() =>
                  router.replace({
                    pathname: '/auth/login/[params]',
                    params: { params: 'entry' },
                  } as never)
                }
              >
                <Text className="text-background-400 text-center text-base">
                  כבר יש לך חשבון? <Text className="text-lime-400 font-semibold">התחבר כאן</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackGround>
  );
}
